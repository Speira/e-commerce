import { Product } from '@speira/e-commerce-schema';

import * as database from '../database';
import { getEnv } from '../env';
import { databaseError } from '../error';

export const PRODUCTS_TABLE = getEnv('PRODUCTS_TABLE');

export const productsRepository = {
  create: async (product: Product) => {
    try {
      return database.putItem(PRODUCTS_TABLE, product);
    } catch (err) {
      throw databaseError('Error creating product:', err as Error);
    }
  },
  getOneById: async (id: string) => {
    try {
      const item = await database.getItem<Product>(PRODUCTS_TABLE, { id });
      return item;
    } catch (err) {
      throw databaseError('Error getting product:', err as Error);
    }
  },
  getManyByCategory: async (category: string, limit: number) => {
    try {
      const items = await database.queryItems<Product>(
        PRODUCTS_TABLE,
        'category = :category',
        { '#category': 'category' },
        { ':category': category },
        {
          indexName: 'CategoryIndex',
          limit,
          scanIndexForward: false, // Most recent first
        },
      );
      return items;
    } catch (err) {
      throw databaseError('Error getting products by category:', err as Error);
    }
  },
  list: async (limit: number) => {
    try {
      return database.scanItems<Product>(PRODUCTS_TABLE, { limit });
    } catch (err) {
      throw databaseError('Error listing products:', err as Error);
    }
  },
  listPaginated: async (limit: number, nextToken?: string) => {
    try {
      const exclusiveStartKey = nextToken
        ? JSON.parse(Buffer.from(nextToken, 'base64').toString('utf-8'))
        : undefined;

      return database.scanItemsPaginated<Product>(PRODUCTS_TABLE, {
        limit,
        exclusiveStartKey,
      });
    } catch (err) {
      throw databaseError('Error listing products:', err as Error);
    }
  },
  delete: async (id: string) => {
    try {
      return database.deleteItem(PRODUCTS_TABLE, { id });
    } catch (err) {
      throw databaseError('Error deleting product:', err as Error);
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
      return database.updateItem<Product>(
        PRODUCTS_TABLE,
        { id },
        options.updateExpression,
        options.expressionAttributeNames,
        options.expressionAttributeValues,
      );
    } catch (err) {
      throw databaseError('Error updating product:', err as Error);
    }
  },
};
