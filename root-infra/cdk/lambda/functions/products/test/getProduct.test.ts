import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import { createMockEvent, createMockProduct } from '../../../test-utils/src';
import {
  DATABASE_MODULE_PATH,
  mockDatabase,
  mockResponse,
  setupProductTests,
} from './test-helpers';

describe('getProduct', () => {
  setupProductTests();

  it('should return a single product successfully', async () => {
    const mockProduct = createMockProduct();

    const { getItem } = require(DATABASE_MODULE_PATH);
    getItem.mockResolvedValue(mockProduct);

    const event: GraphQLEvent = createMockEvent('getProduct', {
      id: 'prod-1',
    });

    const result = await handler(event);

    expect(mockDatabase.getItem).toHaveBeenCalledWith(
      process.env['PRODUCTS_TABLE'],
      { id: 'prod-1' },
    );
    expect(mockResponse.lambdaSuccess).toHaveBeenCalledWith(mockProduct);
    expect(result).toEqual({
      success: true,
      data: mockProduct,
    });
  });

  it('should return error when product not found', async () => {
    const { getItem } = require(DATABASE_MODULE_PATH);
    getItem.mockResolvedValue(null);

    const event: GraphQLEvent = createMockEvent('getProduct', {
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
