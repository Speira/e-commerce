import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import { createMockEvent } from '../../../test-utils/src';
import {
  DATABASE_MODULE_PATH,
  mockResponse,
  setupUserTests,
} from './test-helpers';

describe('createUser', () => {
  setupUserTests();

  it('should create a user successfully', async () => {
    const userInput = {
      email: 'newuser@example.com',
      firstName: 'New',
      lastName: 'User',
      role: 'CUSTOMER',
      phone: '+1111111111',
      address: '789 Pine St',
    };

    const generatedId = 'user-new-123';

    const { generateId } = require(DATABASE_MODULE_PATH);
    generateId.mockReturnValue(generatedId);
    const { putItem } = require(DATABASE_MODULE_PATH);
    putItem.mockResolvedValue(undefined);

    const event: GraphQLEvent = createMockEvent('createUser', {
      input: userInput,
    });

    const result = await handler(event);

    const expectedUser = {
      id: generatedId,
      ...userInput,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    };

    expect(generateId).toHaveBeenCalled();
    expect(putItem).toHaveBeenCalledWith(
      process.env['USERS_TABLE'],
      expectedUser,
    );
    expect(mockResponse.lambdaSuccess).toHaveBeenCalledWith(expectedUser);
    expect(result).toEqual({
      success: true,
      data: expectedUser,
    });
  });

  it('should validate required fields', async () => {
    const invalidInput = {
      firstName: 'Missing email and lastName',
      phone: '+1111111111',
    };

    const event: GraphQLEvent = createMockEvent('createUser', {
      input: invalidInput,
    });

    const result = await handler(event);

    expect(mockResponse.lambdaError).toHaveBeenCalledWith(
      'Email, firstName, and lastName are required',
    );
    expect(result).toEqual({
      success: false,
      error: 'Email, firstName, and lastName are required',
    });
  });

  it('should set default role when not provided', async () => {
    const userInput = {
      email: 'defaultrole@example.com',
      firstName: 'Default',
      lastName: 'Role',
    };

    const generatedId = 'user-default-123';

    const { generateId } = require(DATABASE_MODULE_PATH);
    generateId.mockReturnValue(generatedId);
    const { putItem } = require(DATABASE_MODULE_PATH);
    putItem.mockResolvedValue(undefined);

    const event: GraphQLEvent = createMockEvent('createUser', {
      input: userInput,
    });

    const result = await handler(event);

    const expectedUser = {
      id: generatedId,
      ...userInput,
      role: 'CUSTOMER',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    };

    expect(putItem).toHaveBeenCalledWith(
      process.env['USERS_TABLE'],
      expectedUser,
    );
    expect(result).toEqual({
      success: true,
      data: expectedUser,
    });
  });
});
