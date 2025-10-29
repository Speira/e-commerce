import {
  auth,
  database,
  env,
  error,
  repositories,
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

import { withUser } from '../decorators';
import { createOrderInputSchema, OperationParams } from '../validators';

const { ordersRepository, usersRepository } = repositories;

const ORDERS_TABLE = env.getEnv('ORDERS_TABLE');
const PRODUCTS_TABLE = env.getEnv('PRODUCTS_TABLE');

/** Create an order */
export async function createOrder(
  params: OperationParams,
  event: GraphQLEvent,
): Promise<OrderResponse> {
  // throw auth error if not authenticated
  const authContext = auth.requireAuth(event);

  let input;
  try {
    input = createOrderInputSchema.parse(params['input']);
  } catch (err) {
    throw error.badRequest((err as Error).message);
  }

  auth.requireOwnership(input.userId, authContext);

  const existingOrder = await ordersRepository.getOneByIdempotencyKey(
    input.idempotencyKey,
  );
  if (existingOrder) {
    const enrichedOrder = await withUser(existingOrder);
    return response.lambdaSuccess(enrichedOrder);
  }

  const user = await usersRepository.getOneById(input.userId);
  if (!user) throw error.notFound('User not found');

  const productIds = input.items.map((item) => ({ id: item.productId }));
  const products = await database.batchGetItems<Product>(
    PRODUCTS_TABLE,
    productIds,
  );

  const productMap = new Map(products.map((p) => [p.id, p]));

  let total = 0;
  const orderItems = [];
  const transactItems = [];

  for (const item of input.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      throw error.notFound(`Product with ID "${item.productId}" was not found`);
    }
    if (product.stock < item.quantity) {
      throw error.badRequest(
        `Not enough stock for the product "${product.name}". Available: "${product.stock}", Requested: "${item.quantity}"`,
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

    // Decrement stock
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

  // Create the order object
  const now = new Date().toISOString();
  const order: Order = {
    id: database.generateId(),
    idempotencyKey: input.idempotencyKey,
    createdAt: now,
    items: orderItems,
    shippingAddress: input.shippingAddress,
    status: OrderStatus.PENDING,
    total: NumberUtils.toFloatPrice(total),
    updatedAt: now,
    userId: input.userId,
  };

  // Add order creation to transaction
  transactItems.push({
    Put: {
      TableName: ORDERS_TABLE,
      Item: order,
      // Prevent duplicate idempotency keys
      ConditionExpression: 'attribute_not_exists(idempotencyKey)',
    },
  });

  // Execute transaction atomically
  try {
    await database.executeTransaction(transactItems);
  } catch (err) {
    // Check if it's a conditional check failure
    const errorMessage = (err as Error).message || '';
    if (errorMessage.includes('ConditionalCheckFailed')) {
      // Could be stock insufficient or idempotency key already exists
      // Re-check idempotency key
      const retryOrder = await ordersRepository.getOneByIdempotencyKey(
        input.idempotencyKey,
      );
      if (retryOrder) {
        const enrichedOrder = await withUser(retryOrder);
        return response.lambdaSuccess(enrichedOrder);
      }
      // Otherwise it's a stock issue
      throw error.conflict(
        'Order could not be completed. Stock may have changed. Please try again.',
      );
    }
    throw err;
  }

  const enrichedOrder = await withUser(order);
  return response.lambdaSuccess(enrichedOrder);
}
