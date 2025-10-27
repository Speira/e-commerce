import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import { createMockEvent } from '../../../test-utils/src';
import { mockDatabase, mockResponse, setupOrderTests } from './test-helpers';

describe('deleteOrder', () => {
  setupOrderTests();

  it('should delete an order successfully', async () => {
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

    mockDatabase.getItem.mockResolvedValue(existingOrder);
    mockDatabase.deleteItem.mockResolvedValue(undefined);

    const event: GraphQLEvent = createMockEvent('deleteOrder', {
      id: 'order-1',
    });

    const result = await handler(event);

    expect(mockDatabase.getItem).toHaveBeenCalledWith(
      process.env['ORDERS_TABLE'],
      { id: 'order-1' },
    );
    expect(mockDatabase.deleteItem).toHaveBeenCalledWith(
      process.env['ORDERS_TABLE'],
      { id: 'order-1' },
    );
    expect(mockResponse.lambdaSuccess).toHaveBeenCalledWith({
      message: 'Order deleted successfully',
    });
    expect(result).toEqual({
      success: true,
      data: {
        message: 'Order deleted successfully',
      },
    });
  });

  it('should return error when order not found for deletion', async () => {
    mockDatabase.getItem.mockResolvedValue(null);

    const event: GraphQLEvent = createMockEvent('deleteOrder', {
      id: 'nonexistent',
    });

    const result = await handler(event);

    expect(mockResponse.lambdaError).toHaveBeenCalledWith('Order not found');
    expect(result).toEqual({
      success: false,
      error: 'Order not found',
    });
  });
});
