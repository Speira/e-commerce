import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import { createMockEvent, createMockUser } from '../../../test-utils/src';
import { mockDatabase, mockResponse, setupOrderTests } from './test-helpers';

describe('getOrdersByUser', () => {
  setupOrderTests();

  it('should return orders for a specific user successfully', async () => {
    const mockOrders = [
      {
        id: 'order-1',
        userId: 'user-1',
        status: 'PENDING',
        total: 59.98,
        shippingAddress: '123 Main St, City, State',
        items: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const mockUser = createMockUser();

    mockDatabase.queryItems.mockResolvedValue(mockOrders);
    mockDatabase.getItem.mockResolvedValue(mockUser);

    const event: GraphQLEvent = createMockEvent('getOrdersByUser', {
      userId: 'user-1',
      limit: 10,
    });

    const result = await handler(event);

    expect(mockDatabase.queryItems).toHaveBeenCalledWith(
      process.env['ORDERS_TABLE'],
      'userId = :userId',
      { '#userId': 'userId' },
      { ':userId': 'user-1' },
      {
        indexName: 'UserIndex',
        limit: 10,
        scanIndexForward: false,
      },
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
      ]),
      total: 1,
    });
    expect(result).toEqual({
      success: true,
      data: expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({ id: 'order-1' }),
        ]),
        total: 1,
      }),
    });
  });
});
