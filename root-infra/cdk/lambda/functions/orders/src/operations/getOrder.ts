import {
  auth,
  error,
  repositories,
  response,
} from '@speira/e-commerce-layer-nodejs';
import { GraphQLEvent, OrderResponse } from '@speira/e-commerce-schema';

import { withUser } from '../decorators';
import { OperationParams, orderIdSchema } from '../validators';

const { ordersRepository } = repositories;

/** Get order by ID */
export async function getOrder(
  params: OperationParams,
  event: GraphQLEvent,
): Promise<OrderResponse> {
  // Require authentication
  const authContext = auth.requireAuth(event);

  let id;
  try {
    id = orderIdSchema.parse(params['id']);
  } catch (err) {
    throw error.badRequest((err as Error).message);
  }

  const order = await ordersRepository.getOneById(id);
  if (!order) throw error.notFound('Order not found');

  // Check if user has access to this order
  auth.requireResourceAccess(order.userId, authContext);

  const enrichedOrder = await withUser(order);
  return response.lambdaSuccess(enrichedOrder);
}
