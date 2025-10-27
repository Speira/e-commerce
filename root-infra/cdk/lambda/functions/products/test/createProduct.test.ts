import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import { createMockEvent } from '../../../test-utils/src';
import {
  DATABASE_MODULE_PATH,
  mockResponse,
  setupProductTests,
} from './test-helpers';

describe('createProduct', () => {
  setupProductTests();

  it('should create a product successfully', async () => {
    const productInput = {
      name: 'New Product',
      description: 'A new product',
      price: 39.99,
      stock: 15,
      category: 'Electronics',
      imageUrl: 'https://example.com/new-image.jpg',
    };

    const generatedId = 'prod-new-123';

    const { generateId } = require(DATABASE_MODULE_PATH);
    generateId.mockReturnValue(generatedId);
    const { putItem } = require(DATABASE_MODULE_PATH);
    putItem.mockResolvedValue(undefined);

    const event: GraphQLEvent = createMockEvent('createProduct', {
      input: productInput,
    });

    const result = await handler(event);

    const expectedProduct = {
      id: generatedId,
      ...productInput,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    };

    expect(generateId).toHaveBeenCalled();
    expect(putItem).toHaveBeenCalledWith(
      process.env['PRODUCTS_TABLE'],
      expectedProduct,
    );
    expect(mockResponse.lambdaSuccess).toHaveBeenCalledWith(expectedProduct);
    expect(result).toEqual({
      success: true,
      data: expectedProduct,
    });
  });

  it('should validate required fields', async () => {
    const invalidInput = {
      description: 'Missing name and price',
      stock: 10,
    };

    const event: GraphQLEvent = createMockEvent('createProduct', {
      input: invalidInput,
    });

    const result = await handler(event);

    expect(mockResponse.lambdaError).toHaveBeenCalledWith(
      'Name and price are required',
    );
    expect(result).toEqual({
      success: false,
      error: 'Name and price are required',
    });
  });
});
