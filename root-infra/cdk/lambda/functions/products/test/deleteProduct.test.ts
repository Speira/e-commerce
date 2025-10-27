import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import { createMockEvent, createMockProduct } from '../../../test-utils/src';
import {
  DATABASE_MODULE_PATH,
  mockDatabase,
  mockResponse,
  setupProductTests,
} from './test-helpers';

describe('deleteProduct', () => {
  setupProductTests();

  it('should delete a product successfully', async () => {
    const existingProduct = createMockProduct({
      id: 'prod-1',
      name: 'Product to Delete',
      price: 29.99,
      stock: 10,
    });

    const { getItem } = require(DATABASE_MODULE_PATH);
    getItem.mockResolvedValue(existingProduct);
    const { deleteItem } = require(DATABASE_MODULE_PATH);
    deleteItem.mockResolvedValue(undefined);

    const event: GraphQLEvent = createMockEvent('deleteProduct', {
      id: 'prod-1',
    });

    const result = await handler(event);

    expect(mockDatabase.getItem).toHaveBeenCalledWith(
      process.env['PRODUCTS_TABLE'],
      { id: 'prod-1' },
    );
    expect(mockDatabase.deleteItem).toHaveBeenCalledWith(
      process.env['PRODUCTS_TABLE'],
      { id: 'prod-1' },
    );
    expect(mockResponse.lambdaSuccess).toHaveBeenCalledWith({
      message: 'Product deleted successfully',
    });
    expect(result).toEqual({
      success: true,
      data: {
        message: 'Product deleted successfully',
      },
    });
  });

  it('should return error when product not found for deletion', async () => {
    const { getItem } = require(DATABASE_MODULE_PATH);
    getItem.mockResolvedValue(null);

    const event: GraphQLEvent = createMockEvent('deleteProduct', {
      id: 'nonexistent',
    });

    const result = await handler(event);

    expect(mockResponse.lambdaError).toHaveBeenCalledWith('Product not found');
    expect(result).toEqual({
      success: false,
      error: 'Product not found',
    });
  });
});
