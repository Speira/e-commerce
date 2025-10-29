import {
  auth,
  database,
  error,
  repositories,
  response,
} from '@speira/e-commerce-layer-nodejs';
import { UserRole } from '@speira/e-commerce-lib';
import { GraphQLEvent, User, UserResponse } from '@speira/e-commerce-schema';

import { createUserInputSchema, OperationParams } from '../validators';

const { usersRepository } = repositories;

export async function createUser(
  params: OperationParams,
  event: GraphQLEvent,
): Promise<UserResponse> {
  const authContext = auth.requireAuth(event);
  auth.requireAdmin(authContext);

  let input;
  try {
    input = createUserInputSchema.parse(params['input']);
  } catch (err) {
    throw error.badRequest((err as Error).message);
  }
  const user: User = {
    id: database.generateId(),
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    role: input.role || UserRole.CUSTOMER,
    phone: input.phone || '',
    address: input.address || '',
    isActive: input.isActive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await usersRepository.create(user);

  return response.lambdaSuccess(user);
}
