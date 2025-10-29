import {
  auth,
  error,
  repositories,
  response,
} from '@speira/e-commerce-layer-nodejs';
import { GraphQLEvent, UsersResponse } from '@speira/e-commerce-schema';

import { OperationParams, userLimitSchema } from '../validators';

const { usersRepository } = repositories;

export async function listUsers(
  params: OperationParams,
  event: GraphQLEvent,
): Promise<UsersResponse> {
  const authContext = auth.requireAuth(event);
  auth.requireAdmin(authContext);

  let limit;
  try {
    limit = userLimitSchema.parse(params['limit']);
  } catch (err) {
    throw error.badRequest((err as Error).message);
  }

  const users = await usersRepository.list(limit || 100);

  return response.lambdaSuccess({
    items: users,
    total: users.length,
  });
}
