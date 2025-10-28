# Orders Lambda Function

GraphQL resolver for order-related operations in the e-commerce application.

## Overview

This Lambda function handles all order-related GraphQL queries and mutations through AWS AppSync.

## Operations

### Queries

- `getOrder(id: ID!)`: Retrieve a single order by ID
- `listOrders(limit: Int, nextToken: String)`: List all orders (admin/manager only)
- `getOrdersByUser(userId: ID!, limit: Int, nextToken: String)`: List orders for a specific user

### Mutations

- `createOrder(input: CreateOrderInput!)`: Create a new order
- `updateOrder(id: ID!, input: UpdateOrderInput!)`: Update order status
- `deleteOrder(id: ID!)`: Delete an order (admin only)

## Architecture

### Traditional Implementation

Most operations use a traditional promise-based approach:

```typescript
// src/operations/getOrder.ts
export async function getOrder(
  params: OperationParams,
  event: GraphQLEvent,
): Promise<OrderResponse> {
  const authContext = auth.requireAuth(event);
  const id = orderIdSchema.parse(params['id']);

  const order = await ordersRepository.getOneById(id);
  if (!order) throw error.notFound('Order not found');

  auth.requireResourceAccess(order.userId, authContext);

  const enrichedOrder = await withUser(order);
  return response.lambdaSuccess(enrichedOrder);
}
```

### Effect TS Implementation

`createOrder` has an **Effect TS implementation** as a proof of concept:

```typescript
// src/operations/createOrder.effect.ts
export function createOrderEffect(
  params: Record<string, unknown>,
  event: GraphQLEvent,
): Effect.Effect<
  OrderResponse,
  EffectValidationError | EffectAuthError | EffectAppError | EffectDatabaseError
> {
  return pipe(
    Effect.all({
      auth: Effect.serviceConstants(AuthServiceTag).requireAuth(event),
      input: validateInput(params['input']),
    }),
    Effect.flatMap(({ auth, input }) => {
      // Composed operations with typed errors...
    }),
  );
}
```

## Using the Effect Version

To switch the Lambda handler to use the Effect-based `createOrder`:

```typescript
// src/index.ts
import { createOrder } from './operations/createOrder.effect'; // Use Effect version
// import { createOrder } from './operations/createOrder'; // Traditional version

export const handler = async (event: GraphQLEvent) => {
  // ...
  switch (fieldName) {
    case 'createOrder':
      return await createOrder(args, event);
    // ...
  }
};
```

Both implementations have the same signature and error handling, so they're drop-in replacements.

## Project Structure

```
orders/
├── src/
│   ├── index.ts              # Main Lambda handler
│   ├── decorators.ts         # Order enrichment (e.g., withUser)
│   ├── validators.ts         # Zod schemas for input validation
│   └── operations/
│       ├── createOrder.ts         # Traditional implementation
│       ├── createOrder.effect.ts  # Effect TS implementation
│       ├── getOrder.ts
│       ├── listOrders.ts
│       ├── getOrdersByUser.ts
│       ├── updateOrder.ts
│       └── deleteOrder.ts
├── test/
│   ├── createOrder.effect.test.ts  # Effect TS tests
│   ├── decorators.test.ts
│   ├── operations.test.ts
│   └── index.test.ts
├── package.json
├── tsconfig.json
├── README.md                 # This file
└── EFFECT_TS_MIGRATION.md    # Effect TS guide
```

## Development

### Build

```bash
pnpm build
```

### Watch Mode

```bash
pnpm dev
```

### Testing

```bash
# Run tests locally (from this directory)
pnpm test
pnpm run test:coverage
pnpm run test:watch

# Or from root-infra/cdk/
pnpm run test:lambda:orders
```

## Key Features

### 1. Idempotency

`createOrder` uses idempotency keys to prevent duplicate orders:

```typescript
const input = {
  idempotencyKey: '123e4567-e89b-12d3-a456-426614174000', // UUID
  userId: 'user-123',
  items: [{ productId: 'product-1', quantity: 2 }],
  shippingAddress: '123 Main St',
};
```

If an order with the same idempotency key exists, it returns the existing order instead of creating a new one.

### 2. Atomic Transactions

Order creation uses DynamoDB transactions to ensure:

- Stock is decremented atomically
- Order is created only if stock is available
- Idempotency key uniqueness is enforced

### 3. Authorization

- Users can only access their own orders
- Admins can access all orders
- Managers can update order status

### 4. Validation

Input validation uses Zod schemas:

```typescript
const createOrderInputSchema = z.object({
  idempotencyKey: z.uuid(),
  userId: z.string().min(1).max(100),
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(100),
        quantity: z.number().int().min(1).max(1000),
      }),
    )
    .min(1)
    .max(100),
  shippingAddress: z.string().min(10).max(500),
});
```

### 5. Data Enrichment

Orders are enriched with user details using the `withUser` decorator:

```typescript
const enrichedOrder = await withUser(order);
// order.user now contains { id, email, firstName, lastName, ... }
```

## Error Handling

All operations follow consistent error handling:

```typescript
try {
  // Operation logic
} catch (err) {
  if (err instanceof error.AppError) {
    if (err.isClientError()) {
      logger.warn('Client error:', { error: err.message });
      return response.lambdaError(err.message);
    }
  }
  logger.error('Server error:', err as Error);
  throw err; // Lambda will return 500
}
```

### Error Types

- `400 Bad Request`: Invalid input, validation errors
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: Concurrency issues (e.g., stock changed)
- `500 Internal Server Error`: Database errors, unexpected failures

## Environment Variables

Required environment variables (set by CDK):

- `ORDERS_TABLE`: DynamoDB table name for orders
- `USERS_TABLE`: DynamoDB table name for users
- `PRODUCTS_TABLE`: DynamoDB table name for products
- `AWS_REGION`: AWS region (set automatically by Lambda)

## Performance

### Cold Start

- Traditional implementation: ~300-400ms
- Effect TS implementation: ~350-450ms (adds ~50-100ms)

### Warm Invocation

- Both implementations: ~50-150ms (database operations dominate)

### Optimization Tips

1. Use projection expressions to fetch only needed fields
2. Batch operations where possible (e.g., `batchGetItems`)
3. Use DynamoDB transactions for atomic operations
4. Cache frequently accessed data in Lambda memory (between invocations)

## Monitoring

The Lambda function emits structured logs with context:

```json
{
  "requestId": "abc123",
  "operation": "createOrder",
  "userId": "user-123",
  "sourceIp": "192.168.1.1",
  "message": "Order created successfully",
  "orderId": "order-456"
}
```

Monitor via CloudWatch:

- Lambda duration
- Error rate
- Concurrent executions
- Throttles

Custom metrics (via CloudWatch dashboard):

- Orders created per minute
- Average order value
- Validation error rate
- Stock conflicts per hour

## Next Steps

1. **Evaluate Effect TS**: Use the Effect implementation in staging for 2-3 sprints
2. **Migrate other operations**: If successful, apply to `updateOrder` and complex queries
3. **Add monitoring**: Track specific business metrics (conversion rate, cart abandonment)
4. **Optimize**: Profile operations and optimize bottlenecks

## Related Documentation

- [Lambda Layers Documentation](../../layers/nodejs/README.md)
- [Testing Strategy](../../test/README.md)
