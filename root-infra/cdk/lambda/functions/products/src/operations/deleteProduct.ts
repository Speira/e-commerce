import {
  auth,
  error,
  repositories,
  response,
} from '@speira/e-commerce-layer-nodejs';
import { GraphQLEvent } from '@speira/e-commerce-schema';

import { OperationParams, productIdSchema } from '../validators';

const { productsRepository } = repositories;

export async function deleteProduct(
  params: OperationParams,
  event: GraphQLEvent,
) {
  let id;
  const authContext = auth.requireAuth(event);
  auth.requireAdmin(authContext);

  try {
    id = productIdSchema.parse(params['id']);
  } catch (err) {
    throw error.badRequest((err as Error).message);
  }
  const product = await productsRepository.getOneById(id);
  if (!product) throw error.notFound('Product not found');

  await productsRepository.delete(id);

  return response.lambdaSuccess(product);
}
