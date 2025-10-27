import { NodejsLayer } from '~/lambda/layers/nodejs';
import { GraphQLEvent } from '@speira/e-commerce-schema';

import { OperationParams, userIdSchema } from '../validators';

const { auth, response, error, repositories } = NodejsLayer;
const { usersRepository } = repositories;

export async function deleteUser(
  params: OperationParams,
  event: GraphQLEvent,
): Promise<unknown> {
  const authContext = auth.requireAuth(event);
  auth.requireAdmin(authContext);

  let id;
  try {
    id = userIdSchema.parse(params['id']);
  } catch (err) {
    throw error.badRequest((err as Error).message);
  }

  const user = await usersRepository.getOneById(id);
  if (!user) {
    throw error.notFound('User not found');
  }

  await usersRepository.delete(id);

  return response.lambdaSuccess({ message: 'User deleted successfully' });
}
