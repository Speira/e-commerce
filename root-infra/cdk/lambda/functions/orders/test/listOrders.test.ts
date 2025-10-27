import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import { createMockEvent, createMockUser } from '../../../test-utils/src';
import { mockDatabase, mockResponse, setupOrderTests } from './test-helpers';

describe('listOrders', () => {
  setupOrderTests();

  it('should return list of orders successfully', async () => {
    const mockUser = createMockUser();
    mockDatabase.getItem.mockResolvedValue(mockUser);

    const mockOrders = [
      {
        id: 'order-1',
        userId: 'user-1',
        status: 'PENDING',
        total: 59.98,
        shippingAddress: '123 Main St, City, State',
        items: [
          {
            id: 'item-1',
            productId: 'prod-1',
            quantity: 2,
            price: 29.99,
            createdAt: '2024-01-01T00:00:00Z',
          },
        ],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'order-2',
        userId: 'user-2',
        status: 'DELIVERED',
        total: 49.99,
        shippingAddress: '456 Oak Ave, City, State',
        items: [
          {
            id: 'item-2',
            productId: 'prod-2',
            quantity: 1,
            price: 49.99,
            createdAt: '2024-01-01T00:00:00Z',
          },
        ],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];
    mockDatabase.scanItems.mockResolvedValue(mockOrders);

    const event: GraphQLEvent = createMockEvent('listOrders', { limit: 10 });
    const result = await handler(event);

    expect(mockDatabase.scanItems).toHaveBeenCalledWith(
      process.env['ORDERS_TABLE'],
      { limit: 10 },
    );
    expect(mockResponse.lambdaSuccess).toHaveBeenCalledWith({
      items: expect.arrayContaining([
        expect.objectContaining({
          id: 'order-1',
          userId: 'user-1',
          user: expect.objectContaining({
            id: 'user-1',
            email: mockUser.email,
          }),
        }),
        expect.objectContaining({
          id: 'order-2',
          userId: 'user-2',
          user: expect.objectContaining({
            id: 'user-1',
            email: mockUser.email,
          }),
        }),
      ]),
      total: 2,
    });
    expect(result).toEqual({
      data: expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({ id: 'order-1' }),
          expect.objectContaining({ id: 'order-2' }),
        ]),
        total: 2,
      }),
      success: true,
    });
  });

  it('should handle database errors gracefully', async () => {
    const errorMessage = 'Database connection failed';
    mockDatabase.scanItems.mockRejectedValue(new Error(errorMessage));

    const event: GraphQLEvent = createMockEvent('listOrders', { limit: 10 });
    const result = await handler(event);

    expect(mockResponse.lambdaError).toHaveBeenCalledWith(
      'Failed to list orders',
    );
    expect(result).toEqual({
      success: false,
      error: { message: 'Failed to list orders' },
    });
  });
});
