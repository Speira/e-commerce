import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import { createMockEvent, createMockUser } from '../../../test-utils/src';
import {
  DATABASE_MODULE_PATH,
  mockResponse,
  setupUserTests,
} from './test-helpers';

describe('listUsers', () => {
  setupUserTests();

  it('should return list of users successfully', async () => {
    const mockUsers = [
      createMockUser({
        id: 'user-1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'CUSTOMER',
      }),
      createMockUser({
        id: 'user-2',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'ADMIN',
      }),
    ];

    const { scanItems } = require(DATABASE_MODULE_PATH);
    scanItems.mockResolvedValue(mockUsers);

    const event: GraphQLEvent = createMockEvent('listUsers', { limit: 10 });
    const result = await handler(event);

    expect(scanItems).toHaveBeenCalledWith(process.env['USERS_TABLE'], {
      limit: 10,
    });
    expect(mockResponse.lambdaSuccess).toHaveBeenCalledWith({
      items: mockUsers,
      total: mockUsers.length,
    });
    expect(result).toEqual({
      success: true,
      data: {
        items: mockUsers,
        total: mockUsers.length,
      },
    });
  });

  it('should handle database errors gracefully', async () => {
    const errorMessage = 'Database connection failed';
    const { scanItems } = require(DATABASE_MODULE_PATH);
    scanItems.mockRejectedValue(new Error(errorMessage));

    const event: GraphQLEvent = createMockEvent('listUsers', { limit: 10 });
    const result = await handler(event);

    expect(mockResponse.lambdaError).toHaveBeenCalledWith(
      `Failed to list users: ${errorMessage}`,
    );
    expect(result).toEqual({
      success: false,
      error: `Failed to list users: ${errorMessage}`,
    });
  });
});
