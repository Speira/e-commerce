import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import { createMockEvent, createMockProduct } from '../../../test-utils/src';
import {
  DATABASE_MODULE_PATH,
  mockResponse,
  setupProductTests,
} from './test-helpers';

describe('updateProduct', () => {
  setupProductTests();

  it('should update a product successfully', async () => {
    const updateInput = {
      name: 'Updated Product Name',
      price: 49.99,
      stock: 20,
    };

    const existingProduct = createMockProduct({
      id: 'prod-1',
      name: 'Original Name',
      description: 'Original description',
      price: 29.99,
      stock: 10,
      category: 'Electronics',
    });

    const updatedProduct = {
      ...existingProduct,
      ...updateInput,
      updatedAt: expect.any(String),
    };

    const { getItem } = require(DATABASE_MODULE_PATH);
    getItem.mockResolvedValue(existingProduct);
    const { putItem } = require(DATABASE_MODULE_PATH);
    putItem.mockResolvedValue(undefined);

    const event: GraphQLEvent = createMockEvent('updateProduct', {
      id: 'prod-1',
      input: updateInput,
    });

    const result = await handler(event);

    expect(getItem).toHaveBeenCalledWith(process.env['PRODUCTS_TABLE'], {
      id: 'prod-1',
    });
    expect(putItem).toHaveBeenCalledWith(
      process.env['PRODUCTS_TABLE'],
      updatedProduct,
    );
    expect(mockResponse.lambdaSuccess).toHaveBeenCalledWith(updatedProduct);
    expect(result).toEqual({
      success: true,
      data: updatedProduct,
    });
  });

  it('should return error when product not found for update', async () => {
    const { getItem } = require(DATABASE_MODULE_PATH);
    getItem.mockResolvedValue(null);

    const event: GraphQLEvent = createMockEvent('updateProduct', {
      id: 'nonexistent',
      input: { name: 'Updated' },
    });

    const result = await handler(event);

    expect(mockResponse.lambdaError).toHaveBeenCalledWith('Product not found');
    expect(result).toEqual({
      success: false,
      error: 'Product not found',
    });
  });
});
