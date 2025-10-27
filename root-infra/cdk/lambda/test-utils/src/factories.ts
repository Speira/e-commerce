/** Factory functions for creating mock data objects */

import type { GraphQLEvent } from '@speira/e-commerce-schema';

/** Creates a mock GraphQL event for testing Lambda handlers */
export const createMockEvent = (
  fieldName: string,
  eventArgs: Record<string, unknown> = {},
): GraphQLEvent => ({
  arguments: eventArgs,
  fieldName,
  identity: undefined,
  source: undefined,
  request: undefined,
  prev: null,
});

/** Creates a mock Product object with optional overrides */
export const createMockProduct = (overrides: Record<string, unknown> = {}) => ({
  id: 'prod-1',
  name: 'Test Product',
  description: 'A test product description',
  price: 29.99,
  stock: 10,
  category: 'Electronics',
  imageUrl: 'https://example.com/product.jpg',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

/** Creates a mock User object with optional overrides */
export const createMockUser = (overrides: Record<string, unknown> = {}) => ({
  id: 'user-1',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'CUSTOMER',
  phone: '+1234567890',
  address: '123 Main St, City, State 12345',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

/** Creates a mock Order object with optional overrides */
export const createMockOrder = (overrides: Record<string, unknown> = {}) => ({
  id: 'order-1',
  userId: 'user-1',
  status: 'PENDING',
  total: 59.98,
  shippingAddress: '123 Main St, City, State 12345',
  items: [
    {
      id: 'item-1',
      productId: 'prod-1',
      quantity: 2,
      price: 29.99,
      total: 59.98,
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  ],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

/** Creates a mock OrderItem object with optional overrides */
export const createMockOrderItem = (
  overrides: Record<string, unknown> = {},
) => ({
  id: 'item-1',
  productId: 'prod-1',
  quantity: 1,
  price: 29.99,
  total: 29.99,
  createdAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

/** Creates multiple mock products */
export const createMockProducts = (count: number) =>
  Array.from({ length: count }, (_, i) =>
    createMockProduct({
      id: `prod-${i + 1}`,
      name: `Test Product ${i + 1}`,
      price: 29.99 + i * 10,
    }),
  );

/** Creates multiple mock users */
export const createMockUsers = (count: number) =>
  Array.from({ length: count }, (_, i) =>
    createMockUser({
      id: `user-${i + 1}`,
      email: `user${i + 1}@example.com`,
      firstName: `User${i + 1}`,
    }),
  );

/** Creates multiple mock orders */
export const createMockOrders = (count: number) =>
  Array.from({ length: count }, (_, i) =>
    createMockOrder({
      id: `order-${i + 1}`,
      userId: `user-${i + 1}`,
      total: 59.98 + i * 20,
    }),
  );
