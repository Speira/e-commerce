import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import { createMockEvent } from '../../../test-utils/src';
import { mockDatabase, mockResponse, setupOrderTests } from './test-helpers';

describe('updateOrder', () => {
  setupOrderTests();

  it('should update an order successfully', async () => {
    const updateInput = {
      status: 'SHIPPED',
      shippingAddress: 'Updated Address, City, State',
    };

    const existingOrder = {
      id: 'order-1',
      userId: 'user-1',
      status: 'PENDING',
      total: 59.98,
      shippingAddress: '123 Main St, City, State',
      items: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const updatedOrder = {
      ...existingOrder,
      ...updateInput,
      updatedAt: expect.any(String),
    };

    mockDatabase.getItem.mockResolvedValue(existingOrder);
    mockDatabase.putItem.mockResolvedValue(undefined);

    const event: GraphQLEvent = createMockEvent('updateOrder', {
      id: 'order-1',
      input: updateInput,
    });

    const result = await handler(event);

    expect(mockDatabase.getItem).toHaveBeenCalledWith(
      process.env['ORDERS_TABLE'],
      { id: 'order-1' },
    );
    expect(mockDatabase.putItem).toHaveBeenCalledWith(
      process.env['ORDERS_TABLE'],
      updatedOrder,
    );
    expect(mockResponse.lambdaSuccess).toHaveBeenCalledWith(updatedOrder);
    expect(result).toEqual({
      success: true,
      data: updatedOrder,
    });
  });

  it('should return error when order not found for update', async () => {
    mockDatabase.getItem.mockResolvedValue(null);

    const event: GraphQLEvent = createMockEvent('updateOrder', {
      id: 'nonexistent',
      input: { status: 'SHIPPED' },
    });

    const result = await handler(event);

    expect(mockResponse.lambdaError).toHaveBeenCalledWith('Order not found');
    expect(result).toEqual({
      success: false,
      error: 'Order not found',
    });
  });
});
