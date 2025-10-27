import { Order } from '@speira/e-commerce-schema';

import * as database from '../database';
import { getEnv } from '../env';
import { databaseError } from '../error';

export const ORDERS_TABLE = getEnv('ORDERS_TABLE');

export const ordersRepository = {
  create: (order: Order) => {
    try {
      return database.putItem(ORDERS_TABLE, order);
    } catch (err) {
      throw databaseError('Error creating order:', err as Error);
    }
  },
  getOneById: (id: string) => {
    try {
      return database.getItem<Order>(ORDERS_TABLE, { id });
    } catch (err) {
      throw databaseError('Error getting order:', err as Error);
    }
  },
  getOneByIdempotencyKey: async (idempotencyKey: string) => {
    try {
      const items = await database.queryItems<Order>(
        ORDERS_TABLE,
        'idempotencyKey = :idempotencyKey',
        { '#idempotencyKey': 'idempotencyKey' },
        { ':idempotencyKey': idempotencyKey },
        {
          indexName: 'IdempotencyIndex',
          limit: 1,
        },
      );
      return items[0] || null;
    } catch (err) {
      throw databaseError(
        'Error getting order by idempotency key:',
        err as Error,
      );
    }
  },
  getManyByUserId: async (userId: string, limit: number) => {
    try {
      const items = await database.queryItems<Order>(
        ORDERS_TABLE,
        'userId = :userId',
        { '#userId': 'userId' },
        { ':userId': userId },
        {
          indexName: 'UserIndex',
          limit,
          scanIndexForward: false, // Most recent first
        },
      );
      return items;
    } catch (err) {
      throw databaseError('Error getting orders by user:', err as Error);
    }
  },
  getManyByUserIdPaginated: async (
    userId: string,
    limit: number,
    nextToken?: string,
  ) => {
    try {
      const exclusiveStartKey = nextToken
        ? JSON.parse(Buffer.from(nextToken, 'base64').toString('utf-8'))
        : undefined;

      return database.queryItemsPaginated<Order>(
        ORDERS_TABLE,
        'userId = :userId',
        { '#userId': 'userId' },
        { ':userId': userId },
        {
          indexName: 'UserIndex',
          limit,
          scanIndexForward: false, // Most recent first
          exclusiveStartKey,
        },
      );
    } catch (err) {
      throw databaseError('Error getting orders by user:', err as Error);
    }
  },
  list: (limit: number) => {
    try {
      return database.scanItems<Order>(ORDERS_TABLE, { limit });
    } catch (err) {
      throw databaseError('Error listing orders:', err as Error);
    }
  },
  listPaginated: (limit: number, nextToken?: string) => {
    try {
      const exclusiveStartKey = nextToken
        ? JSON.parse(Buffer.from(nextToken, 'base64').toString('utf-8'))
        : undefined;

      return database.scanItemsPaginated<Order>(ORDERS_TABLE, {
        limit,
        exclusiveStartKey,
      });
    } catch (err) {
      throw databaseError('Error listing orders:', err as Error);
    }
  },
  delete: (id: string) => {
    try {
      return database.deleteItem(ORDERS_TABLE, { id });
    } catch (err) {
      throw databaseError('Error deleting order:', err as Error);
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
      return database.updateItem<Order>(
        ORDERS_TABLE,
        { id },
        options.updateExpression,
        options.expressionAttributeNames,
        options.expressionAttributeValues,
      );
    } catch (err) {
      throw databaseError('Error updating order:', err as Error);
    }
  },
};
