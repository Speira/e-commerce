import { GraphQLEvent, Order, Product, User } from '@speira/e-commerce-schema';

import { handler as ordersHandler } from '~/lambda/functions/orders/src/index';
import { handler as productsHandler } from '~/lambda/functions/products/src/index';
import { LambdaResponse } from '~/lambda/functions/users/dist/types';
import { handler as usersHandler } from '~/lambda/functions/users/src/index';

// Mock the database layer with in-memory storage for integration tests
const mockDatabase = new Map<string, unknown>();

jest.mock('~/lambda/layers/nodejs/src/database', () => ({
  getItem: jest.fn((table: string, id: string) => {
    const key = `${table}:${id}`;
    return Promise.resolve(mockDatabase.get(key) || null);
  }),
  putItem: jest.fn((table: string, item: { id: string }) => {
    const key = `${table}:${item.id}`;
    mockDatabase.set(key, item);
    return Promise.resolve(item);
  }),
  queryItems: jest.fn((table: string, _: unknown) => {
    const items = Array.from(mockDatabase.entries())
      .filter(([key]) => key.startsWith(`${table}:`))
      .map(([, value]) => value);
    return Promise.resolve(items);
  }),
  deleteItem: jest.fn((table: string, id: string) => {
    const key = `${table}:${id}`;
    const item = mockDatabase.get(key);
    mockDatabase.delete(key);
    return Promise.resolve(item);
  }),
}));

describe('GraphQL Integration Tests', () => {
  beforeEach(() => {
    mockDatabase.clear();
    jest.clearAllMocks();
  });

  describe('Complete E-commerce Flow', () => {
    let userId: string;
    let productId: string;
    let orderId: string;

    it('should create a user', async () => {
      const event: GraphQLEvent = {
        fieldName: 'createUser',
        arguments: {
          input: {
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'CUSTOMER',
            phone: '+1234567890',
            address: '123 Main St',
          },
        },
      };

      const result = (await usersHandler(event)) as LambdaResponse<User>;

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      userId = result.data?.id ?? '';
    });

    it('should create a product', async () => {
      const event: GraphQLEvent = {
        fieldName: 'createProduct',
        arguments: {
          input: {
            name: 'Test Product',
            description: 'A great product',
            price: 29.99,
            stock: 100,
            category: 'Electronics',
          },
        },
      };

      const result = (await productsHandler(event)) as LambdaResponse<Product>;

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        name: 'Test Product',
        price: 29.99,
        stock: 100,
      });

      productId = result.data?.id ?? '';
    });

    it('should create an order with the user and product', async () => {
      const event: GraphQLEvent = {
        fieldName: 'createOrder',
        arguments: {
          input: {
            userId,
            items: [
              {
                productId,
                quantity: 2,
              },
            ],
            shippingAddress: '123 Main St, City, State',
          },
        },
      };

      const result = (await ordersHandler(event)) as LambdaResponse<Order>;

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        userId,
        status: 'PENDING',
        total: 59.98, // 29.99 * 2
        items: expect.arrayContaining([
          expect.objectContaining({
            productId,
            quantity: 2,
            price: 29.99,
          }),
        ]),
      });

      orderId = result.data?.id ?? '';
    });

    it('should update order status', async () => {
      const event: GraphQLEvent = {
        fieldName: 'updateOrder',
        arguments: {
          id: orderId,
          input: {
            status: 'PROCESSING',
          },
        },
      };

      const result = (await ordersHandler(event)) as LambdaResponse<Order>;

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe('PROCESSING');
    });

    it('should list orders for user', async () => {
      const event: GraphQLEvent = {
        fieldName: 'getOrdersByUser',
        arguments: {
          userId,
          limit: 10,
        },
      };

      const result = (await ordersHandler(event)) as LambdaResponse<Order[]>;

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0]?.id).toBe(orderId);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle invalid product in order creation', async () => {
      const event: GraphQLEvent = {
        fieldName: 'createOrder',
        arguments: {
          input: {
            userId: 'user-123',
            items: [
              {
                productId: 'non-existent-product',
                quantity: 1,
              },
            ],
            shippingAddress: '123 Main St',
          },
        },
      };

      const result = (await ordersHandler(event)) as LambdaResponse<Order>;

      expect(result.success).toBe(false);
      expect(result.error).toContain('Product not found');
    });

    it('should handle out of stock scenario', async () => {
      // Create a product with limited stock
      const productEvent: GraphQLEvent = {
        fieldName: 'createProduct',
        arguments: {
          input: {
            name: 'Limited Product',
            price: 10.0,
            stock: 1,
          },
        },
      };

      const productResult = (await productsHandler(
        productEvent,
      )) as LambdaResponse<Product>;
      const limitedProductId = productResult.data?.id ?? '';

      // Try to order more than available
      const orderEvent: GraphQLEvent = {
        fieldName: 'createOrder',
        arguments: {
          input: {
            userId: 'user-123',
            items: [
              {
                productId: limitedProductId,
                quantity: 5,
              },
            ],
          },
        },
      };

      const result = (await ordersHandler(orderEvent)) as LambdaResponse<Order>;

      expect(result.success).toBe(false);
      expect(result.error).toContain('Insufficient stock');
    });
  });

  describe('Query Integration Tests', () => {
    beforeEach(async () => {
      // Seed test data
      for (let i = 1; i <= 5; i++) {
        await productsHandler({
          fieldName: 'createProduct',
          arguments: {
            input: {
              name: `Product ${i}`,
              price: i * 10,
              stock: i * 5,
              category: i % 2 === 0 ? 'Electronics' : 'Books',
            },
          },
        });
      }
    });

    it('should list all products', async () => {
      const event: GraphQLEvent = {
        fieldName: 'listProducts',
        arguments: {
          limit: 10,
        },
      };

      const result = (await productsHandler(event)) as LambdaResponse<
        Product[]
      >;

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(5);
    });

    it('should filter products by category', async () => {
      const event: GraphQLEvent = {
        fieldName: 'listProducts',
        arguments: {
          filter: {
            category: 'Electronics',
          },
          limit: 10,
        },
      };

      const result = (await productsHandler(event)) as LambdaResponse<
        Product[]
      >;

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(
        result.data?.every((p: Product) => p.category === 'Electronics'),
      ).toBe(true);
    });
  });
});
