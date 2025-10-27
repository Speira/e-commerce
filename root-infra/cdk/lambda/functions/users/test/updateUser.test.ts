import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import { createMockEvent, createMockUser } from '../../../test-utils/src';
import {
  DATABASE_MODULE_PATH,
  mockDatabase,
  mockResponse,
  setupUserTests,
} from './test-helpers';

describe('updateUser', () => {
  setupUserTests();

  it('should update a user successfully', async () => {
    const updateInput = {
      firstName: 'Updated First Name',
      phone: '+9999999999',
      address: 'Updated Address',
    };

    const existingUser = createMockUser({
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
    });

    const updatedUser = {
      ...existingUser,
      ...updateInput,
      updatedAt: expect.any(String),
    };

    const { getItem } = require(DATABASE_MODULE_PATH);
    getItem.mockResolvedValue(existingUser);
    const { putItem } = require(DATABASE_MODULE_PATH);
    putItem.mockResolvedValue(undefined);

    const event: GraphQLEvent = createMockEvent('updateUser', {
      id: 'user-1',
      input: updateInput,
    });

    const result = await handler(event);

    expect(getItem).toHaveBeenCalledWith(process.env['USERS_TABLE'], {
      id: 'user-1',
    });
    expect(putItem).toHaveBeenCalledWith(
      process.env['USERS_TABLE'],
      updatedUser,
    );
    expect(mockResponse.lambdaSuccess).toHaveBeenCalledWith(updatedUser);
    expect(result).toEqual({
      success: true,
      data: updatedUser,
    });
  });

  it('should return error when user not found for update', async () => {
    mockDatabase.getItem.mockResolvedValue(null);

    const event: GraphQLEvent = createMockEvent('updateUser', {
      id: 'nonexistent',
      input: { firstName: 'Updated' },
    });

    const result = await handler(event);

    expect(mockResponse.lambdaError).toHaveBeenCalledWith('User not found');
    expect(result).toEqual({
      success: false,
      error: 'User not found',
    });
  });
});
