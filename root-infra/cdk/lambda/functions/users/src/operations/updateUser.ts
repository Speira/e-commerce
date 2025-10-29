import {
  auth,
  error,
  repositories,
  response,
} from '@speira/e-commerce-layer-nodejs';
import { GraphQLEvent, UserResponse } from '@speira/e-commerce-schema';

import {
  OperationParams,
  updateUserInputSchema,
  userIdSchema,
} from '../validators';

const { usersRepository } = repositories;

export async function updateUser(
  params: OperationParams,
  event: GraphQLEvent,
): Promise<UserResponse> {
  const authContext = auth.requireAuth(event);
  auth.requireAdmin(authContext);

  let id, input;
  try {
    id = userIdSchema.parse(params['id']);
    input = updateUserInputSchema.parse(params['input']);
  } catch (err) {
    throw error.badRequest((err as Error).message);
  }

  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, unknown> = {};

  if (input.email !== undefined) {
    updateExpressions.push('#email = :email');
    expressionAttributeNames['#email'] = 'email';
    expressionAttributeValues[':email'] = input.email;
  }

  if (input.firstName !== undefined) {
    updateExpressions.push('#firstName = :firstName');
    expressionAttributeNames['#firstName'] = 'firstName';
    expressionAttributeValues[':firstName'] = input.firstName;
  }

  if (input.lastName !== undefined) {
    updateExpressions.push('#lastName = :lastName');
    expressionAttributeNames['#lastName'] = 'lastName';
    expressionAttributeValues[':lastName'] = input.lastName;
  }

  if (input.role !== undefined) {
    updateExpressions.push('#role = :role');
    expressionAttributeNames['#role'] = 'role';
    expressionAttributeValues[':role'] = input.role;
  }

  if (input.phone !== undefined) {
    updateExpressions.push('#phone = :phone');
    expressionAttributeNames['#phone'] = 'phone';
    expressionAttributeValues[':phone'] = input.phone;
  }

  if (input.address !== undefined) {
    updateExpressions.push('#address = :address');
    expressionAttributeNames['#address'] = 'address';
    expressionAttributeValues[':address'] = input.address;
  }

  if (input.isActive !== undefined) {
    updateExpressions.push('#isActive = :isActive');
    expressionAttributeNames['#isActive'] = 'isActive';
    expressionAttributeValues[':isActive'] = input.isActive;
  }

  updateExpressions.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';
  expressionAttributeValues[':updatedAt'] = new Date().toISOString();

  if (updateExpressions.length === 0) {
    throw error.badRequest('No fields to update');
  }

  const updateExpression = `SET ${updateExpressions.join(', ')}`;

  const updatedUser = await usersRepository.update(id, {
    updateExpression,
    expressionAttributeNames,
    expressionAttributeValues,
  });

  if (!updatedUser) {
    throw error.notFound('User not found');
  }

  return response.lambdaSuccess(updatedUser);
}
