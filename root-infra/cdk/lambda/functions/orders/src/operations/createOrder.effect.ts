import {
  EffectAppError,
  EffectAuthError,
  EffectDatabaseError,
  effectUtils,
  EffectValidationError,
  env,
  error,
  response,
} from '@speira/e-commerce-layer-nodejs';
import { NumberUtils } from '@speira/e-commerce-lib';
import {
  GraphQLEvent,
  Order,
  OrderResponse,
  OrderStatus,
  Product,
} from '@speira/e-commerce-schema';
import { Effect, pipe } from 'effect';

import { withUser } from '../decorators';
import { CreateOrderInput, createOrderInputSchema } from '../validators';

const ORDERS_TABLE = env.getEnv('ORDERS_TABLE');
const PRODUCTS_TABLE = env.getEnv('PRODUCTS_TABLE');

const validateInput = (
  params: unknown,
): Effect.Effect<CreateOrderInput, EffectValidationError> =>
  Effect.try({
    try: () => createOrderInputSchema.parse(params),
    catch: (err) => new EffectValidationError((err as Error).message, err),
  });

const checkIdempotency = (idempotencyKey: string) =>
  Effect.gen(function* () {
    const repo = yield* effectUtils.RepositoryServiceTag;
    const existingOrder =
      yield* repo.orders.getOneByIdempotencyKey(idempotencyKey);
    return existingOrder;
  });

const verifyUserExists = (userId: string) =>
  Effect.gen(function* () {
    const repo = yield* effectUtils.RepositoryServiceTag;
    const user = yield* repo.users.getOneById(userId);

    if (!user) {
      return yield* Effect.fail(
        new EffectAppError(error.notFound('User not found')),
      );
    }

    return user;
  });

/** Batch fetch and validate products */
function fetchAndValidateProducts(
  items: Array<{ productId: string; quantity: number }>,
) {
  return Effect.gen(function* () {
    const db = yield* effectUtils.DatabaseServiceTag;

    // Batch fetch all products
    const productIds = items.map((item) => ({ id: item.productId }));
    const products = yield* db.batchGetItems<Product>(
      PRODUCTS_TABLE,
      productIds,
    );

    // Create a map for quick lookup
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate all products and calculate totals
    let total = 0;
    const orderItems = [];
    const transactItems = [];

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product) {
        return yield* Effect.fail(
          new EffectAppError(
            error.notFound(`Product with ID "${item.productId}" was not found`),
          ),
        );
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return yield* Effect.fail(
          new EffectAppError(
            error.badRequest(
              `Insufficient stock for product "${product.name}". Available: "${product.stock}", Requested: "${item.quantity}"`,
            ),
          ),
        );
      }

      const itemTotal = NumberUtils.toIntPrice(product.price) * item.quantity;
      total += itemTotal;

      orderItems.push({
        price: product.price,
        product: {
          id: product.id,
          name: product.name,
          ...(product.imageUrl && { imageUrl: product.imageUrl }),
        },
        productId: item.productId,
        quantity: item.quantity,
        total: NumberUtils.toFloatPrice(itemTotal),
      });

      // Add stock decrement to transaction with condition check
      transactItems.push({
        Update: {
          TableName: PRODUCTS_TABLE,
          Key: { id: item.productId },
          UpdateExpression: 'SET stock = stock - :quantity, updatedAt = :now',
          ConditionExpression: 'stock >= :quantity',
          ExpressionAttributeValues: {
            ':quantity': item.quantity,
            ':now': new Date().toISOString(),
          },
        },
      });
    }

    return { orderItems, transactItems, total };
  });
}

/** Execute transaction to create order and update stock */
function executeOrderTransaction(order: Order, transactItems: Array<unknown>) {
  return Effect.gen(function* () {
    const db = yield* effectUtils.DatabaseServiceTag;
    const repo = yield* effectUtils.RepositoryServiceTag;

    // Add order creation to transaction
    const allTransactItems = [
      ...transactItems,
      {
        Put: {
          TableName: ORDERS_TABLE,
          Item: order,
          // Prevent duplicate idempotency keys
          ConditionExpression: 'attribute_not_exists(idempotencyKey)',
        },
      },
    ];

    // Execute transaction
    const result = yield* Effect.catchTag(
      db.executeTransaction(allTransactItems),
      'EffectDatabaseError',
      (dbError) =>
        Effect.gen(function* () {
          // Check if it's a conditional check failure
          const errorMessage = dbError.message || '';

          if (errorMessage.includes('ConditionalCheckFailed')) {
            // Could be stock insufficient or idempotency key already exists
            // Re-check idempotency key
            const retryOrder = yield* repo.orders.getOneByIdempotencyKey(
              order.idempotencyKey,
            );

            if (retryOrder) {
              return retryOrder;
            }

            // Otherwise it's a stock issue
            return yield* Effect.fail(
              new EffectAppError(
                error.conflict(
                  'Order could not be completed. Stock may have changed. Please try again.',
                ),
              ),
            );
          }

          return yield* Effect.fail(dbError);
        }),
    );

    return result || order;
  });
}

/** Main createOrder operation using Effect TS */
export function createOrderEffect(
  params: Record<string, unknown>,
  event: GraphQLEvent,
): Effect.Effect<
  OrderResponse,
  EffectValidationError | EffectAuthError | EffectAppError | EffectDatabaseError
> {
  return pipe(
    Effect.all({
      auth: Effect.serviceConstants(effectUtils.AuthServiceTag).requireAuth(
        event,
      ),
      input: validateInput(params['input']),
      db: Effect.service(effectUtils.DatabaseServiceTag),
    }),
    Effect.flatMap(({ auth, input, db }) =>
      pipe(
        // Verify ownership
        Effect.serviceConstants(effectUtils.AuthServiceTag).requireOwnership(
          input.userId,
          auth,
        ),
        Effect.flatMap(() => checkIdempotency(input.idempotencyKey)),
        Effect.flatMap((existingOrder) => {
          // If order exists, return it immediately
          if (existingOrder) {
            return Effect.promise(() => withUser(existingOrder)).pipe(
              Effect.map((enriched) => response.lambdaSuccess(enriched)),
            );
          }

          // Otherwise, create new order
          return pipe(
            Effect.all({
              user: verifyUserExists(input.userId),
              productsData: fetchAndValidateProducts(input.items),
            }),
            Effect.flatMap(({ productsData }) => {
              const now = new Date().toISOString();
              const order: Order = {
                id: db.generateId(),
                idempotencyKey: input.idempotencyKey,
                createdAt: now,
                items: productsData.orderItems,
                shippingAddress: input.shippingAddress,
                status: OrderStatus.PENDING,
                total: NumberUtils.toFloatPrice(productsData.total),
                updatedAt: now,
                userId: input.userId,
              };

              return pipe(
                executeOrderTransaction(order, productsData.transactItems),
                Effect.flatMap((finalOrder) =>
                  Effect.promise(() => withUser(finalOrder)),
                ),
                Effect.map((enriched) => response.lambdaSuccess(enriched)),
              );
            }),
          );
        }),
      ),
    ),
  );
}

/**
 * Wrapper function to run the Effect and handle errors This is what you'd call
 * from the Lambda handler
 */
export async function createOrder(
  params: Record<string, unknown>,
  event: GraphQLEvent,
): Promise<OrderResponse> {
  try {
    return await effectUtils.runWithServices(createOrderEffect(params, event));
  } catch (err) {
    // Convert Effect errors back to AppError
    if (
      err &&
      typeof err === 'object' &&
      '_tag' in err &&
      (err._tag === 'EffectAppError' ||
        err._tag === 'EffectDatabaseError' ||
        err._tag === 'EffectValidationError' ||
        err._tag === 'EffectAuthError')
    ) {
      throw effectUtils.adaptEffectError(err);
    }
    throw err;
  }
}
