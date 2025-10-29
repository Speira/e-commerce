import {
  auth,
  error,
  repositories,
  response,
} from '@speira/e-commerce-layer-nodejs';
import {
  GraphQLEvent,
  OrderResponse,
  UpdateOrderInputSchema,
} from '@speira/e-commerce-schema';

import { withUser } from '../decorators';
import { OperationParams, orderIdSchema } from '../validators';

const { ordersRepository } = repositories;

/** Update an order */
export async function updateOrder(
  params: OperationParams,
  event: GraphQLEvent,
): Promise<OrderResponse> {
  // Require authentication
  const authContext = auth.requireAuth(event);

  let id, input;
  try {
    id = orderIdSchema.parse(params['id']);
    input = UpdateOrderInputSchema.parse(params['input']);
  } catch (err) {
    throw error.badRequest((err as Error).message);
  }

  // Check if order exists first
  const existingOrder = await ordersRepository.getOneById(id);
  if (!existingOrder) throw error.notFound('Order not found');

  // Check if user can modify this order
  auth.requireResourceModification(existingOrder.userId, authContext);

  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, unknown> = {};

  // Build update expression dynamically
  if (input.status !== undefined) {
    updateExpressions.push('#status = :status');
    expressionAttributeNames['#status'] = 'status';
    expressionAttributeValues[':status'] = input.status;
  }
  if (input.shippingAddress !== undefined) {
    updateExpressions.push('#shippingAddress = :shippingAddress');
    expressionAttributeNames['#shippingAddress'] = 'shippingAddress';
    expressionAttributeValues[':shippingAddress'] = input.shippingAddress;
  }
  // Always update the updatedAt timestamp
  updateExpressions.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';
  expressionAttributeValues[':updatedAt'] = new Date().toISOString();

  if (updateExpressions.length === 0)
    throw error.badRequest('No fields to update');

  const updateExpression = `SET ${updateExpressions.join(', ')}`;
  const updatedOrder = await ordersRepository.update(id, {
    updateExpression,
    expressionAttributeNames,
    expressionAttributeValues,
  });
  if (!updatedOrder) throw error.notFound('Order not found');
  // Enrich order with product and user details
  const enrichedOrder = await withUser(updatedOrder);
  return response.lambdaSuccess(enrichedOrder);
}
