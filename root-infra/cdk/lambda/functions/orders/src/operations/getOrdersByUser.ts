import {
  auth,
  database,
  env,
  error,
  repositories,
  response,
} from '@speira/e-commerce-layer-nodejs';
import {
  GraphQLEvent,
  Order,
  OrdersResponse,
  User,
} from '@speira/e-commerce-schema';

import {
  OperationParams,
  orderLimitSchema,
  paginationTokenSchema,
  userIdSchema,
} from '../validators';

const { ordersRepository } = repositories;

const USERS_TABLE = env.getEnv('USERS_TABLE');

/** Get orders by user ID */
export async function getOrdersByUser(
  params: OperationParams,
  event: GraphQLEvent,
): Promise<OrdersResponse> {
  // Require authentication
  const authContext = auth.requireAuth(event);

  let userId, limit, nextToken;
  try {
    userId = userIdSchema.parse(params['userId']);
    limit = orderLimitSchema.parse(params['limit']);
    nextToken = paginationTokenSchema.parse(params['nextToken']);
  } catch (err) {
    throw error.badRequest((err as Error).message);
  }

  // Users can only view their own orders (unless admin)
  auth.requireOwnership(userId, authContext);

  const result = await ordersRepository.getManyByUserIdPaginated(
    userId,
    limit || 10,
    nextToken,
  );
  const orders = result.items;

  // Since all orders belong to the same user, we only need one fetch
  if (orders.length === 0) {
    return response.lambdaSuccess({
      items: [],
      total: 0,
    });
  }

  const user = await database.getItem<User>(USERS_TABLE, { id: userId });

  // Enrich orders with user data
  const enrichedOrders = orders.map((order: Order) => ({
    ...order,
    user: user
      ? {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive,
          ...(user.phone && { phone: user.phone }),
          ...(user.address && { address: user.address }),
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      : null,
  }));

  // Encode the nextToken
  const responseNextToken = result.lastEvaluatedKey
    ? Buffer.from(JSON.stringify(result.lastEvaluatedKey)).toString('base64')
    : undefined;

  const responseData: {
    items: typeof enrichedOrders;
    total: number;
    nextToken?: string;
  } = {
    items: enrichedOrders,
    total: enrichedOrders.length,
  };

  if (responseNextToken) {
    responseData.nextToken = responseNextToken;
  }

  return response.lambdaSuccess(responseData);
}
