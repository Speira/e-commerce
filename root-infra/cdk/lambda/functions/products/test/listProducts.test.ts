import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import { createMockEvent, createMockProduct } from '../../../test-utils/src';
import {
  DATABASE_MODULE_PATH,
  mockDatabase,
  mockResponse,
  setupProductTests,
} from './test-helpers';

describe('listProducts', () => {
  setupProductTests();

  it('should return list of products successfully', async () => {
    const mockProducts = [
      createMockProduct({
        id: 'prod-1',
        name: 'Test Product 1',
        price: 29.99,
        stock: 10,
        category: 'Electronics',
      }),
      createMockProduct({
        id: 'prod-2',
        name: 'Test Product 2',
        price: 49.99,
        stock: 5,
        category: 'Books',
      }),
    ];

    const { scanItems } = require(DATABASE_MODULE_PATH);
    scanItems.mockResolvedValue(mockProducts);

    const event: GraphQLEvent = createMockEvent('listProducts', {
      limit: 10,
    });

    const result = await handler(event);

    expect(mockDatabase.scanItems).toHaveBeenCalledWith(
      process.env['PRODUCTS_TABLE'],
      { limit: 10 },
    );
    expect(mockResponse.lambdaSuccess).toHaveBeenCalledWith({
      items: mockProducts,
      total: mockProducts.length,
    });
    expect(result).toEqual({
      success: true,
      data: {
        items: mockProducts,
        total: mockProducts.length,
      },
    });
  });

  it('should handle database errors gracefully', async () => {
    const errorMessage = 'Database connection failed';
    const { scanItems } = require(DATABASE_MODULE_PATH);
    scanItems.mockRejectedValue(new Error(errorMessage));

    const event: GraphQLEvent = createMockEvent('listProducts', {
      limit: 10,
    });

    const result = await handler(event);

    expect(mockResponse.lambdaError).toHaveBeenCalledWith(
      `Failed to list products: ${errorMessage}`,
    );
    expect(result).toEqual({
      success: false,
      error: `Failed to list products: ${errorMessage}`,
    });
  });
});
