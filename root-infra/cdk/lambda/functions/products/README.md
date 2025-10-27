# Products Lambda Function

GraphQL resolver for product-related operations in the e-commerce application.

## Overview

This Lambda function handles all product-related GraphQL queries and mutations through AWS AppSync.

## Operations

### Queries

- `getProduct(id: ID!)`: Retrieve a single product by ID
- `listProducts(limit: Int, nextToken: String)`: List all products with pagination

### Mutations

- `createProduct(input: CreateProductInput!)`: Create a new product
- `updateProduct(id: ID!, input: UpdateProductInput!)`: Update product details
- `deleteProduct(id: ID!)`: Delete a product (admin only)

## Project Structure

```
products/
├── src/
│   ├── index.ts              # Main Lambda handler
│   ├── validators.ts         # Zod schemas for input validation
│   └── operations/
│       ├── createProduct.ts
│       ├── getProduct.ts
│       ├── listProducts.ts
│       ├── updateProduct.ts
│       └── deleteProduct.ts
├── test/
│   ├── index.test.ts         # Lambda handler tests
│   └── setup.ts              # Test setup
├── jest.config.js            # Jest configuration
├── package.json
├── tsconfig.json
└── README.md                 # This file
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
pnpm run test:lambda:products
```

## Key Features

### 1. Input Validation

Uses Zod schemas for robust input validation:

```typescript
const createProductInputSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  price: z.number().positive().max(1000000),
  stock: z.number().int().min(0).max(1000000),
  category: z.string().min(1).max(100),
  imageUrl: z.string().url().max(500).optional(),
});
```

### 2. Authorization

- Authenticated users can view products
- Only admins can create, update, or delete products

### 3. Data Consistency

- Atomic updates using DynamoDB
- Optimistic locking for concurrent updates
- Validation before persistence

## Error Handling

All operations follow consistent error patterns:

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
- `404 Not Found`: Product doesn't exist
- `500 Internal Server Error`: Database errors, unexpected failures

## Environment Variables

Required environment variables (set by CDK):

- `PRODUCTS_TABLE`: DynamoDB table name for products
- `PRODUCT_BUCKET`: S3 bucket for product images
- `AWS_REGION`: AWS region (set automatically by Lambda)

## Example Operations

### Create Product

```graphql
mutation CreateProduct {
  createProduct(
    input: {
      name: "Wireless Mouse"
      description: "Ergonomic wireless mouse"
      price: 29.99
      stock: 100
      category: "Electronics"
      imageUrl: "https://example.com/mouse.jpg"
    }
  ) {
    id
    name
    price
    stock
  }
}
```

### Get Product

```graphql
query GetProduct {
  getProduct(id: "prod-123") {
    id
    name
    description
    price
    stock
    category
    imageUrl
    createdAt
    updatedAt
  }
}
```

### List Products

```graphql
query ListProducts {
  listProducts(limit: 20) {
    items {
      id
      name
      price
      stock
    }
    total
    nextToken
  }
}
```

## Performance

### Cold Start

- ~300-400ms with provisioned concurrency
- ~500-600ms without provisioned concurrency

### Warm Invocation

- ~50-100ms (database operations dominate)

### Optimization Tips

1. Use projection expressions to fetch only needed fields
2. Cache frequently accessed products in Lambda memory
3. Use DynamoDB Global Secondary Indexes for efficient queries
4. Batch operations where possible

## Monitoring

The Lambda function emits structured logs with context:

```json
{
  "requestId": "abc123",
  "operation": "createProduct",
  "userId": "admin-123",
  "message": "Product created successfully",
  "productId": "prod-456"
}
```

Monitor via CloudWatch:

- Lambda duration
- Error rate
- Concurrent executions
- Throttles

Custom metrics:

- Products created per hour
- Most viewed products
- Low stock alerts
- Price change frequency

## Related Documentation

- [Root CDK README](../../README.md)
- [Lambda Layers Documentation](../../layers/nodejs/README.md)
- [DynamoDB Indexes](../../DYNAMODB_INDEXES.md)
- [Testing Strategy](../../test/README.md)
