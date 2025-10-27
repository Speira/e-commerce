import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import { createMockEvent, createMockUser } from '../../../test-utils/src';
import { mockDatabase, mockResponse, setupOrderTests } from './test-helpers';

describe('getOrder', () => {
  setupOrderTests();

  it('should return a single order successfully', async () => {
    const mockOrder = {
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
    };

    const mockUser = createMockUser();

    mockDatabase.getItem
      .mockResolvedValueOnce(mockOrder)
      .mockResolvedValueOnce(mockUser);

    const event: GraphQLEvent = createMockEvent('getOrder', {
      id: 'order-1',
    });

    const result = await handler(event);

    expect(mockDatabase.getItem).toHaveBeenCalledWith(
      process.env['ORDERS_TABLE'],
      { id: 'order-1' },
    );
    expect(mockResponse.lambdaSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockOrder,
        user: expect.objectContaining({
          id: 'user-1',
          email: mockUser.email,
        }),
      }),
    );
    expect(result).toEqual({
      data: expect.objectContaining({
        ...mockOrder,
        user: expect.objectContaining({
          id: 'user-1',
          email: mockUser.email,
        }),
      }),
      success: true,
    });
  });

  it('should return error when order not found', async () => {
    mockDatabase.getItem.mockResolvedValue(null);

    const event: GraphQLEvent = createMockEvent('getOrder', {
      id: 'getOrder.nonexistent',
    });

    const result = await handler(event);

    expect(mockResponse.lambdaError).toHaveBeenCalledWith('Order not found');
    expect(result).toEqual({
      success: false,
      error: { message: 'Order not found' },
    });
  });
});
