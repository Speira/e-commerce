import { NodejsLayer } from '~/lambda/layers/nodejs';

import { OperationParams, productIdSchema } from '../validators';

const { repositories, response, error } = NodejsLayer;
const { productsRepository } = repositories;

export const getProduct = async (params: OperationParams) => {
  let id;
  try {
    id = productIdSchema.parse(params['id']);
  } catch (err) {
    throw error.badRequest((err as Error).message);
  }

  const product = await productsRepository.getOneById(id);

  if (!product) throw error.notFound('Product not found');

  return response.lambdaSuccess(product);
};
