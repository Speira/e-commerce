import {
  auth,
  error,
  repositories,
  response,
} from '@speira/e-commerce-layer-nodejs';
import { GraphQLEvent } from '@speira/e-commerce-schema';

import {
  OperationParams,
  productIdSchema,
  updateProductInputSchema,
} from '../validators';

const { productsRepository } = repositories;

export async function updateProduct(
  params: OperationParams,
  event: GraphQLEvent,
): Promise<unknown> {
  const authContext = auth.requireAuth(event);
  auth.requireAdmin(authContext);

  let id, input;
  try {
    id = productIdSchema.parse(params['id']);
    input = updateProductInputSchema.parse(params['input']);
  } catch (err) {
    throw error.badRequest((err as Error).message);
  }

  const product = await productsRepository.getOneById(id);
  if (!product) throw error.notFound('Product not found');

  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, unknown> = {};

  if (input.name !== undefined) {
    updateExpressions.push('#name = :name');
    expressionAttributeNames['#name'] = 'name';
    expressionAttributeValues[':name'] = input.name;
  }

  if (input.description !== undefined) {
    updateExpressions.push('#description = :description');
    expressionAttributeNames['#description'] = 'description';
    expressionAttributeValues[':description'] = input.description;
  }

  if (input.price !== undefined) {
    updateExpressions.push('#price = :price');
    expressionAttributeNames['#price'] = 'price';
    expressionAttributeValues[':price'] = input.price;
  }

  if (input.category !== undefined) {
    updateExpressions.push('#category = :category');
    expressionAttributeNames['#category'] = 'category';
    expressionAttributeValues[':category'] = input.category;
  }

  if (input.imageUrl !== undefined) {
    updateExpressions.push('#imageUrl = :imageUrl');
    expressionAttributeNames['#imageUrl'] = 'imageUrl';
    expressionAttributeValues[':imageUrl'] = input.imageUrl;
  }

  if (input.stock !== undefined) {
    updateExpressions.push('#stock = :stock');
    expressionAttributeNames['#stock'] = 'stock';
    expressionAttributeValues[':stock'] = input.stock;
  }

  updateExpressions.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';
  expressionAttributeValues[':updatedAt'] = new Date().toISOString();

  if (updateExpressions.length === 0) {
    throw error.badRequest('No fields to update');
  }

  const updateExpression = `SET ${updateExpressions.join(', ')}`;

  const updatedProduct = await productsRepository.update(id, {
    updateExpression,
    expressionAttributeNames,
    expressionAttributeValues,
  });

  if (!updatedProduct) {
    throw error.notFound('Product not found');
  }

  return response.lambdaSuccess(updatedProduct);
}
