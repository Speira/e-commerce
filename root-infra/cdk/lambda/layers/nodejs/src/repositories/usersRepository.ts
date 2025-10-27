import { User } from '@speira/e-commerce-schema';

import * as database from '../database';
import { getEnv } from '../env';
import { databaseError } from '../error';

export const USERS_TABLE = getEnv('USERS_TABLE');

export const usersRepository = {
  create: async (user: User) => {
    try {
      return database.putItem(USERS_TABLE, user);
    } catch (err) {
      throw databaseError('Error creating user:', err as Error);
    }
  },
  getOneById: async (id: string) => {
    try {
      const item = await database.getItem<User>(USERS_TABLE, { id });
      return item;
    } catch (err) {
      throw databaseError('Error getting user:', err as Error);
    }
  },
  getOneByEmail: async (email: string) => {
    try {
      const items = await database.queryItems<User>(
        USERS_TABLE,
        'email = :email',
        { '#email': 'email' },
        { ':email': email.toLowerCase() },
        {
          indexName: 'EmailIndex',
          limit: 1,
        },
      );
      return items[0] || null;
    } catch (err) {
      throw databaseError('Error getting user by email:', err as Error);
    }
  },
  getManyByRole: async (role: string, limit: number) => {
    try {
      const items = await database.queryItems<User>(
        USERS_TABLE,
        'role = :role',
        { '#role': 'role' },
        { ':role': role },
        {
          indexName: 'RoleIndex',
          limit,
          scanIndexForward: false, // Most recent first
        },
      );
      return items;
    } catch (err) {
      throw databaseError('Error getting users by role:', err as Error);
    }
  },
  list: async (limit: number) => {
    try {
      return database.scanItems<User>(USERS_TABLE, { limit });
    } catch (err) {
      throw databaseError('Error listing users:', err as Error);
    }
  },
  listPaginated: async (limit: number, nextToken?: string) => {
    try {
      const exclusiveStartKey = nextToken
        ? JSON.parse(Buffer.from(nextToken, 'base64').toString('utf-8'))
        : undefined;
      return database.scanItemsPaginated<User>(USERS_TABLE, {
        limit,
        exclusiveStartKey,
      });
    } catch (err) {
      throw databaseError('Error listing users:', err as Error);
    }
  },
  delete: async (id: string) => {
    try {
      return database.deleteItem(USERS_TABLE, { id });
    } catch (err) {
      throw databaseError('Error deleting user:', err as Error);
    }
  },
  update: async (
    id: string,
    options: {
      updateExpression: string;
      expressionAttributeNames: Record<string, string>;
      expressionAttributeValues: Record<string, unknown>;
    },
  ) => {
    try {
      return database.updateItem<User>(
        USERS_TABLE,
        { id },
        options.updateExpression,
        options.expressionAttributeNames,
        options.expressionAttributeValues,
      );
    } catch (err) {
      throw databaseError('Error updating user:', err as Error);
    }
  },
};
