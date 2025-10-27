import { OrderStatus, UserRole } from '@speira/e-commerce-schema';
import { Context, Effect, Layer } from 'effect';

import {
  AuthService,
  AuthServiceTag,
  DatabaseService,
  DatabaseServiceTag,
  EffectAppError,
  EffectAuthError,
  EffectDatabaseError,
  EffectValidationError,
  RepositoryService,
  RepositoryServiceTag,
} from '~/lambda/layers/nodejs/src/effectUtils';

import { createOrderEffect } from '../src/operations/createOrder.effect';

/** Mock implementations for testing */

const mockAuthService: AuthService = {
  requireAuth: (event: any) =>
    Effect.succeed({
      userId: event.identity?.userId || 'user-123',
      userRole: UserRole.USER,
      isAdmin: false,
      isManager: false,
    }),
  requireOwnership: () => Effect.succeed(undefined),
  requireResourceAccess: () => Effect.succeed(undefined),
  requireAdmin: () => Effect.succeed(undefined),
  requireManager: () => Effect.succeed(undefined),
};

const mockDatabaseService: DatabaseService = {
  getItem: () => Effect.succeed(null),
  putItem: () => Effect.succeed(undefined),
  batchGetItems: (tableName, keys) => {
    // Return mock products
    return Effect.succeed(
      keys.map((key: any) => ({
        id: key.id,
        name: `Product ${key.id}`,
        price: 99.99,
        stock: 100,
        imageUrl: 'https://example.com/image.jpg',
      })),
    );
  },
  executeTransaction: () => Effect.succeed(undefined),
  generateId: () => 'order-123',
};

const mockRepositoryService: RepositoryService = {
  orders: {
    getOneById: (id) => Effect.succeed(null),
    getOneByIdempotencyKey: (key) => Effect.succeed(null),
  },
  users: {
    getOneById: (id) =>
      Effect.succeed({
        id,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.USER,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
  },
  products: {
    getOneById: (id) =>
      Effect.succeed({
        id,
        name: 'Test Product',
        price: 99.99,
        stock: 100,
      }),
  },
};

const MockAuthServiceLayer = Layer.succeed(AuthServiceTag, mockAuthService);
const MockDatabaseServiceLayer = Layer.succeed(
  DatabaseServiceTag,
  mockDatabaseService,
);
const MockRepositoryServiceLayer = Layer.succeed(
  RepositoryServiceTag,
  mockRepositoryService,
);

const TestServicesLayer = Layer.mergeAll(
  MockAuthServiceLayer,
  MockDatabaseServiceLayer,
  MockRepositoryServiceLayer,
);

/** Tests */

describe('createOrderEffect', () => {
  const validInput = {
    input: {
      idempotencyKey: '123e4567-e89b-12d3-a456-426614174000',
      userId: 'user-123',
      items: [
        {
          productId: 'product-1',
          quantity: 2,
        },
      ],
      shippingAddress: '123 Main St, City, Country',
    },
  };

  const mockEvent = {
    identity: {
      userId: 'user-123',
      sub: 'user-123',
    },
    fieldName: 'createOrder',
    arguments: validInput,
  };

  it('should successfully create an order', async () => {
    const effect = createOrderEffect(validInput, mockEvent as any);
    const result = await Effect.runPromise(
      Effect.provide(effect, TestServicesLayer),
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('order-123');
      expect(result.data.userId).toBe('user-123');
      expect(result.data.status).toBe(OrderStatus.PENDING);
      expect(result.data.items).toHaveLength(1);
    }
  });

  it('should fail with validation error for invalid input', async () => {
    const invalidInput = {
      input: {
        // Missing required fields
        userId: 'user-123',
      },
    };

    const effect = createOrderEffect(invalidInput, mockEvent as any);

    await expect(
      Effect.runPromise(Effect.provide(effect, TestServicesLayer)),
    ).rejects.toMatchObject({
      _tag: 'EffectValidationError',
    });
  });

  it('should fail with validation error for invalid UUID', async () => {
    const invalidInput = {
      input: {
        idempotencyKey: 'not-a-uuid',
        userId: 'user-123',
        items: [
          {
            productId: 'product-1',
            quantity: 2,
          },
        ],
        shippingAddress: '123 Main St, City, Country',
      },
    };

    const effect = createOrderEffect(invalidInput, mockEvent as any);

    await expect(
      Effect.runPromise(Effect.provide(effect, TestServicesLayer)),
    ).rejects.toMatchObject({
      _tag: 'EffectValidationError',
    });
  });

  it('should return existing order when idempotency key matches', async () => {
    const existingOrder = {
      id: 'existing-order-123',
      idempotencyKey: validInput.input.idempotencyKey,
      userId: 'user-123',
      status: OrderStatus.PENDING,
      items: [],
      shippingAddress: '123 Main St',
      total: 199.98,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockRepoWithExisting: RepositoryService = {
      ...mockRepositoryService,
      orders: {
        getOneById: (id) => Effect.succeed(null),
        getOneByIdempotencyKey: (key) => Effect.succeed(existingOrder as any),
      },
    };

    const CustomLayer = Layer.mergeAll(
      MockAuthServiceLayer,
      MockDatabaseServiceLayer,
      Layer.succeed(RepositoryServiceTag, mockRepoWithExisting),
    );

    const effect = createOrderEffect(validInput, mockEvent as any);
    const result = await Effect.runPromise(Effect.provide(effect, CustomLayer));

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('existing-order-123');
    }
  });

  it('should fail when user does not exist', async () => {
    const mockRepoNoUser: RepositoryService = {
      ...mockRepositoryService,
      users: {
        getOneById: (id) => Effect.succeed(null),
      },
    };

    const CustomLayer = Layer.mergeAll(
      MockAuthServiceLayer,
      MockDatabaseServiceLayer,
      Layer.succeed(RepositoryServiceTag, mockRepoNoUser),
    );

    const effect = createOrderEffect(validInput, mockEvent as any);

    await expect(
      Effect.runPromise(Effect.provide(effect, CustomLayer)),
    ).rejects.toMatchObject({
      _tag: 'EffectAppError',
    });
  });

  it('should fail when product is not found', async () => {
    const mockDbNoProducts: DatabaseService = {
      ...mockDatabaseService,
      batchGetItems: () => Effect.succeed([]), // No products found
    };

    const CustomLayer = Layer.mergeAll(
      MockAuthServiceLayer,
      Layer.succeed(DatabaseServiceTag, mockDbNoProducts),
      MockRepositoryServiceLayer,
    );

    const effect = createOrderEffect(validInput, mockEvent as any);

    await expect(
      Effect.runPromise(Effect.provide(effect, CustomLayer)),
    ).rejects.toMatchObject({
      _tag: 'EffectAppError',
    });
  });

  it('should fail when product has insufficient stock', async () => {
    const mockDbLowStock: DatabaseService = {
      ...mockDatabaseService,
      batchGetItems: (tableName, keys) =>
        Effect.succeed(
          keys.map((key: any) => ({
            id: key.id,
            name: `Product ${key.id}`,
            price: 99.99,
            stock: 1, // Less than requested quantity
            imageUrl: 'https://example.com/image.jpg',
          })),
        ),
    };

    const CustomLayer = Layer.mergeAll(
      MockAuthServiceLayer,
      Layer.succeed(DatabaseServiceTag, mockDbLowStock),
      MockRepositoryServiceLayer,
    );

    const effect = createOrderEffect(validInput, mockEvent as any);

    await expect(
      Effect.runPromise(Effect.provide(effect, CustomLayer)),
    ).rejects.toMatchObject({
      _tag: 'EffectAppError',
    });
  });

  it('should handle authentication errors', async () => {
    const mockAuthFailure: AuthService = {
      ...mockAuthService,
      requireAuth: () =>
        Effect.fail(new EffectAuthError('Authentication required', 401)),
    };

    const CustomLayer = Layer.mergeAll(
      Layer.succeed(AuthServiceTag, mockAuthFailure),
      MockDatabaseServiceLayer,
      MockRepositoryServiceLayer,
    );

    const effect = createOrderEffect(validInput, mockEvent as any);

    await expect(
      Effect.runPromise(Effect.provide(effect, CustomLayer)),
    ).rejects.toMatchObject({
      _tag: 'EffectAuthError',
      code: 401,
    });
  });

  it('should handle ownership check failures', async () => {
    const mockAuthOwnershipFailure: AuthService = {
      ...mockAuthService,
      requireOwnership: () =>
        Effect.fail(
          new EffectAuthError('You can only access your own resources', 403),
        ),
    };

    const CustomLayer = Layer.mergeAll(
      Layer.succeed(AuthServiceTag, mockAuthOwnershipFailure),
      MockDatabaseServiceLayer,
      MockRepositoryServiceLayer,
    );

    const effect = createOrderEffect(validInput, mockEvent as any);

    await expect(
      Effect.runPromise(Effect.provide(effect, CustomLayer)),
    ).rejects.toMatchObject({
      _tag: 'EffectAuthError',
      code: 403,
    });
  });
});
