import { error, repositories, response } from '@speira/e-commerce-layer-nodejs';

import { OperationParams, productLimitSchema } from '../validators';

const { productsRepository } = repositories;

export async function listProducts(params: OperationParams) {
  let limit;
  try {
    limit = productLimitSchema.parse(params['limit']);
  } catch (err) {
    throw error.badRequest((err as Error).message);
  }

  const products = await productsRepository.list(limit || 100);

  return response.lambdaSuccess({
    items: products,
    total: products.length,
  });
}
