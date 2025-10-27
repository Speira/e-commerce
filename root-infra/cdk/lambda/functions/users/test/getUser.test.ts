import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import { createMockEvent, createMockUser } from '../../../test-utils/src';
import {
  DATABASE_MODULE_PATH,
  mockResponse,
  setupUserTests,
} from './test-helpers';

describe('getUser', () => {
  setupUserTests();

  it('should return a single user successfully', async () => {
    const mockUser = createMockUser();

    const { getItem } = require(DATABASE_MODULE_PATH);
    getItem.mockResolvedValue(mockUser);

    const event: GraphQLEvent = createMockEvent('getUser', { id: 'user-1' });
    const result = await handler(event);

    expect(getItem).toHaveBeenCalledWith(process.env['USERS_TABLE'], {
      id: 'user-1',
    });
    expect(mockResponse.lambdaSuccess).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual({
      success: true,
      data: mockUser,
    });
  });

  it('should return error when user not found', async () => {
    const { getItem } = require(DATABASE_MODULE_PATH);
    getItem.mockResolvedValue(null);

    const event: GraphQLEvent = createMockEvent('getUser', {
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
