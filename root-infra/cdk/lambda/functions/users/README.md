# Users Lambda Function

GraphQL resolver for user-related operations in the e-commerce application.

## Overview

This Lambda function handles all user-related GraphQL queries and mutations through AWS AppSync.

## Operations

### Queries

- `getUser(id: ID!)`: Retrieve a single user by ID
- `listUsers(limit: Int, nextToken: String)`: List all users (admin only)

### Mutations

- `createUser(input: CreateUserInput!)`: Create a new user
- `updateUser(id: ID!, input: UpdateUserInput!)`: Update user profile
- `deleteUser(id: ID!)`: Delete a user (admin only)

## Project Structure

```
users/
├── src/
│   ├── index.ts              # Main Lambda handler
│   ├── validators.ts         # Zod schemas for input validation
│   └── operations/
│       ├── createUser.ts
│       ├── getUser.ts
│       ├── listUsers.ts
│       ├── updateUser.ts
│       └── deleteUser.ts
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
pnpm run test:lambda:users
```

## Key Features

### 1. Input Validation

Uses Zod schemas for robust input validation:

```typescript
const createUserInputSchema = z.object({
  email: z.string().email().max(100),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  role: z.enum(['CUSTOMER', 'ADMIN', 'MANAGER']).default('CUSTOMER'),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
});
```

### 2. Authorization

- Users can view and update their own profile
- Admins can view, create, update, and delete all users
- Email uniqueness is enforced

### 3. Role Management

Supported roles:

- **CUSTOMER**: Can place orders, view own profile
- **ADMIN**: Full access to all resources
- **MANAGER**: Can manage orders and products

### 4. Data Privacy

- Password hashing (via Cognito)
- PII protection in logs
- Audit trail for sensitive operations

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
- `404 Not Found`: User doesn't exist
- `409 Conflict`: Email already exists
- `500 Internal Server Error`: Database errors, unexpected failures

## Environment Variables

Required environment variables (set by CDK):

- `USERS_TABLE`: DynamoDB table name for users
- `USER_BUCKET`: S3 bucket for user avatars
- `AWS_REGION`: AWS region (set automatically by Lambda)

## Example Operations

### Create User

```graphql
mutation CreateUser {
  createUser(
    input: {
      email: "john.doe@example.com"
      firstName: "John"
      lastName: "Doe"
      role: CUSTOMER
      phone: "+1234567890"
      address: "123 Main St, City, State 12345"
    }
  ) {
    id
    email
    firstName
    lastName
    role
    createdAt
  }
}
```

### Get User

```graphql
query GetUser {
  getUser(id: "user-123") {
    id
    email
    firstName
    lastName
    role
    phone
    address
    createdAt
    updatedAt
  }
}
```

### Update User

```graphql
mutation UpdateUser {
  updateUser(
    id: "user-123"
    input: { firstName: "Jane", phone: "+0987654321" }
  ) {
    id
    firstName
    phone
    updatedAt
  }
}
```

### List Users (Admin Only)

```graphql
query ListUsers {
  listUsers(limit: 50) {
    items {
      id
      email
      firstName
      lastName
      role
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
2. Cache frequently accessed user data in Lambda memory
3. Use DynamoDB Global Secondary Indexes for email lookups
4. Batch operations where possible

## Monitoring

The Lambda function emits structured logs with context:

```json
{
  "requestId": "abc123",
  "operation": "createUser",
  "email": "john.doe@example.com",
  "message": "User created successfully",
  "userId": "user-456"
}
```

Monitor via CloudWatch:

- Lambda duration
- Error rate
- Concurrent executions
- Throttles

Custom metrics:

- New user registrations per day
- User role distribution
- Profile update frequency
- Failed login attempts

## Security Considerations

### PII Protection

- Email addresses are indexed but not logged in plaintext errors
- Phone numbers are masked in logs
- Addresses are not included in monitoring metrics

### Audit Trail

All sensitive operations are logged:

- User creation
- Role changes
- Profile updates
- User deletion

### Rate Limiting

WAF rules protect against:

- Brute force attacks
- Account enumeration
- Rapid profile updates

## Related Documentation

- [Root CDK README](../../README.md)
- [Lambda Layers Documentation](../../layers/nodejs/README.md)
- [DynamoDB Indexes](../../DYNAMODB_INDEXES.md)
- [Cognito Setup](../../COGNITO_SETUP.md)
- [Testing Strategy](../../test/README.md)
