import { NodejsLayer } from '~/lambda/layers/nodejs';
import { GraphQLEvent, Product } from '@speira/e-commerce-schema';

import { createProductInputSchema, OperationParams } from '../validators';

const { auth, database, response, error, repositories } = NodejsLayer;
const { productsRepository } = repositories;

export async function createProduct(
  params: OperationParams,
  event: GraphQLEvent,
) {
  const authContext = auth.requireAuth(event);
  auth.requireAdmin(authContext);

  let input;
  try {
    input = createProductInputSchema.parse(params['input']);
  } catch (err) {
    throw error.badRequest((err as Error).message);
  }

  const product: Product = {
    id: database.generateId(),
    name: input.name,
    description: input.description || '',
    price: input.price,
    category: input.category || 'general',
    imageUrl: input.imageUrl || '',
    stock: input.stock || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await productsRepository.create(product);

  return response.lambdaSuccess(product);
}
