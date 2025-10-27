import type { GraphQLEvent } from '@speira/e-commerce-schema';

import {
  createMockEvent,
  createMockProduct,
  createMockUser,
} from '../../../test-utils/src';
import { handler } from '../src/index';

import { mockDatabase, mockResponse, setupOrderTests } from './test-helpers';

describe('createOrder', () => {
  setupOrderTests();

  it('should create an order successfully', async () => {
    const orderInput = {
      userId: 'user-1',
      items: [
        { productId: 'prod-1', quantity: 2 },
        { productId: 'prod-2', quantity: 1 },
      ],
      shippingAddress: '123 Main St, City, State',
    };

    const mockProducts = [
      createMockProduct({
        id: 'prod-1',
        name: 'Product 1',
        price: 29.99,
        stock: 10,
      }),
      createMockProduct({
        id: 'prod-2',
        name: 'Product 2',
        price: 49.99,
        stock: 5,
      }),
    ];

    const mockUser = createMockUser();
    const generatedId = 'order-new-123';

    mockDatabase.generateId.mockReturnValue(generatedId);
    mockDatabase.getItem
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(mockProducts[0])
      .mockResolvedValueOnce(mockProducts[1])
      .mockResolvedValueOnce(mockUser);
    mockDatabase.putItem.mockResolvedValue(undefined);

    const event: GraphQLEvent = createMockEvent('createOrder', {
      input: orderInput,
    });

    const result = await handler(event);

    const expectedSavedOrder = {
      id: generatedId,
      createdAt: expect.any(String),
      items: [
        {
          price: 29.99,
          product: {
            id: mockProducts[0].id,
            name: mockProducts[0].name,
          },
          productId: 'prod-1',
          quantity: 2,
          total: 59.98,
        },
        {
          price: 49.99,
          productId: 'prod-2',
          product: {
            id: mockProducts[1].id,
            name: mockProducts[1].name,
          },
          quantity: 1,
          total: 49.99,
        },
      ],
      shippingAddress: '123 Main St, City, State',
      status: 'PENDING',
      total: 109.97,
      updatedAt: expect.any(String),
      userId: 'user-1',
    };

    const expectedEnrichedOrder = {
      ...expectedSavedOrder,
      user: {
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      },
    };

    expect(mockDatabase.generateId).toHaveBeenCalled();
    expect(mockDatabase.getItem).toHaveBeenCalledTimes(4);
    expect(mockDatabase.putItem).toHaveBeenCalledWith(
      process.env['ORDERS_TABLE'],
      expectedSavedOrder,
    );
    expect(mockResponse.lambdaSuccess).toHaveBeenCalledWith(
      expectedEnrichedOrder,
    );
    expect(result).toEqual({
      success: true,
      data: expectedEnrichedOrder,
    });
  });

  it('should validate required fields', async () => {
    const invalidInput = {
      userId: 'user-1',
      shippingAddress: '123 Main St',
    };

    const event: GraphQLEvent = createMockEvent('createOrder', {
      input: invalidInput,
    });

    const result = await handler(event);

    expect(mockResponse.lambdaError).toHaveBeenCalledWith(
      'UserId, items, and shippingAddress are required',
    );
    expect(result).toEqual({
      success: false,
      error: 'UserId, items, and shippingAddress are required',
    });
  });

  it('should return error when user not found', async () => {
    const orderInput = {
      userId: 'nonexistent',
      items: [{ productId: 'prod-1', quantity: 1 }],
      shippingAddress: '123 Main St',
    };

    mockDatabase.getItem.mockResolvedValue(null);

    const event: GraphQLEvent = createMockEvent('createOrder', {
      input: orderInput,
    });

    const result = await handler(event);

    expect(mockResponse.lambdaError).toHaveBeenCalledWith('User not found');
    expect(result).toEqual({
      success: false,
      error: 'User not found',
    });
  });

  it('should return error when product not found', async () => {
    const orderInput = {
      userId: 'user-1',
      items: [{ productId: 'nonexistent', quantity: 1 }],
      shippingAddress: '123 Main St',
    };

    const mockUser = createMockUser();

    mockDatabase.getItem
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(null);

    const event: GraphQLEvent = createMockEvent('createOrder', {
      input: orderInput,
    });

    const result = await handler(event);

    expect(mockResponse.lambdaError).toHaveBeenCalledWith(
      'Product not found: nonexistent',
    );
    expect(result).toEqual({
      success: false,
      error: 'Product not found: nonexistent',
    });
  });
});
