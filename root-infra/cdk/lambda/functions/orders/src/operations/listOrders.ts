import { NodejsLayer } from '~/lambda/layers/nodejs';
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
} from '../validators';

const { auth, database, response, env, error, repositories } = NodejsLayer;
const { ordersRepository } = repositories;

const USERS_TABLE = env.getEnv('USERS_TABLE');

export async function listOrders(
  params: OperationParams,
  event: GraphQLEvent,
): Promise<OrdersResponse> {
  // Only managers and admins can list all orders
  const authContext = auth.requireAuth(event);
  auth.requireManager(authContext);

  let limit, nextToken;
  try {
    limit = orderLimitSchema.parse(params['limit']);
    nextToken = paginationTokenSchema.parse(params['nextToken']);
  } catch (err) {
    throw error.badRequest((err as Error).message);
  }

  const result = await ordersRepository.listPaginated(limit || 10, nextToken);
  const orders = result.items;

  // Batch fetch all unique users
  const uniqueUserIds = [...new Set(orders.map((order) => order.userId))];
  const userKeys = uniqueUserIds.map((userId) => ({ id: userId }));
  const users = await database.batchGetItems<User>(USERS_TABLE, userKeys);

  // Create user map for quick lookup
  const userMap = new Map(users.map((user) => [user.id, user]));

  // Enrich orders with user data
  const enrichedOrders = orders.map((order: Order) => {
    const user = userMap.get(order.userId);
    return {
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
    };
  });

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
