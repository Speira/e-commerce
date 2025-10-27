import { NodejsLayer } from '~/lambda/layers/nodejs';
import { GraphQLEvent, OrderResponse } from '@speira/e-commerce-schema';

import { withUser } from '../decorators';
import { OperationParams, orderIdSchema } from '../validators';

const { auth, response, error, repositories } = NodejsLayer;
const { ordersRepository } = repositories;

export async function deleteOrder(
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

  // Check if user can delete this order
  auth.requireResourceModification(order.userId, authContext);

  // Delete the order
  await ordersRepository.delete(id);

  const enrichedOrder = await withUser(order);
  return response.lambdaSuccess(enrichedOrder);
}
