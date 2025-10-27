import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import { createMockEvent, createMockUser } from '../../../test-utils/src';
import {
  DATABASE_MODULE_PATH,
  mockDatabase,
  mockResponse,
  setupUserTests,
} from './test-helpers';

describe('deleteUser', () => {
  setupUserTests();

  it('should delete a user successfully', async () => {
    const existingUser = createMockUser();

    const { getItem } = require(DATABASE_MODULE_PATH);
    getItem.mockResolvedValue(existingUser);
    const { deleteItem } = require(DATABASE_MODULE_PATH);
    deleteItem.mockResolvedValue(undefined);
    mockDatabase.deleteItem.mockResolvedValue(undefined);

    const event: GraphQLEvent = createMockEvent('deleteUser', {
      id: 'user-1',
    });

    const result = await handler(event);

    expect(getItem).toHaveBeenCalledWith(process.env['USERS_TABLE'], {
      id: 'user-1',
    });
    expect(deleteItem).toHaveBeenCalledWith(process.env['USERS_TABLE'], {
      id: 'user-1',
    });
    expect(mockResponse.lambdaSuccess).toHaveBeenCalledWith({
      message: 'User deleted successfully',
    });
    expect(result).toEqual({
      success: true,
      data: {
        message: 'User deleted successfully',
      },
    });
  });

  it('should return error when user not found for deletion', async () => {
    const { getItem } = require(DATABASE_MODULE_PATH);
    getItem.mockResolvedValue(null);

    const event: GraphQLEvent = createMockEvent('deleteUser', {
      id: 'nonexistent',
    });

    const result = await handler(event);

    expect(mockResponse.lambdaError).toHaveBeenCalledWith('User not found');
    expect(result).toEqual({
      success: false,
      error: 'User not found',
    });
  });
});
