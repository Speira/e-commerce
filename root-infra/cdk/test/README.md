# Testing Guide

This directory contains infrastructure and integration tests for the e-commerce CDK stack. Lambda function tests are now co-located with their respective code.

## Test Structure

```
root-infra/cdk/
├── test/                                    # Infrastructure & Integration tests
│   ├── ecommerce-infrastructure-stack.test.ts
│   ├── cdk-snapshot.test.ts
│   ├── integration/
│   │   └── graphql-integration.test.ts
│   ├── setup.ts
│   └── README.md (this file)
├── lambda/
│   ├── test-utils/                          # Shared test utilities
│   │   ├── src/
│   │   │   ├── mocks.ts
│   │   │   ├── factories.ts
│   │   │   ├── setup.ts
│   │   │   └── index.ts
│   │   └── README.md
│   ├── functions/
│   │   ├── orders/
│   │   │   ├── src/
│   │   │   ├── test/                        # Orders Lambda tests
│   │   │   │   ├── index.test.ts
│   │   │   │   └── setup.ts
│   │   │   ├── jest.config.js
│   │   │   └── package.json
│   │   ├── products/
│   │   │   ├── src/
│   │   │   ├── test/                        # Products Lambda tests
│   │   │   │   ├── index.test.ts
│   │   │   │   └── setup.ts
│   │   │   ├── jest.config.js
│   │   │   └── package.json
│   │   └── users/
│   │       ├── src/
│   │       ├── test/                        # Users Lambda tests
│   │       │   ├── index.test.ts
│   │       │   └── setup.ts
│   │       ├── jest.config.js
│   │       └── package.json
│   └── layers/
│       └── nodejs/
│           ├── src/
│           ├── test/                        # Layer tests
│           │   ├── database.test.ts
│           │   ├── response.test.ts
│           │   └── setup.ts
│           ├── jest.config.js
│           └── package.json
└── jest.config.js                           # Root Jest config (all projects)
```

## Running Tests

### Run All Tests (Infrastructure + Lambdas + Layers)

```bash
pnpm test
```

### Run Specific Test Suites

```bash
# Infrastructure tests only (CDK stack tests)
pnpm run test:infrastructure

# Integration tests only
pnpm run test:integration

# All lambda function tests
pnpm run test:lambda

# Individual lambda tests
pnpm run test:lambda:orders
pnpm run test:lambda:products
pnpm run test:lambda:users

# Layer tests
pnpm run test:layer

# Snapshot tests only
pnpm run test:snapshot

# Update snapshots (when infrastructure changes are intentional)
pnpm run test:snapshot:update
```

### Run Tests with Coverage

```bash
# All tests with coverage
pnpm run test:coverage

# Individual lambda coverage (from lambda directory)
cd lambda/functions/orders
pnpm run test:coverage
```

### Run Tests in Watch Mode

```bash
# Watch all tests
pnpm run test:watch

# Watch individual lambda (from lambda directory)
cd lambda/functions/orders
pnpm run test:watch
```

### Run Tests for CI/CD

```bash
pnpm run test:ci
```

## Shared Test Utilities

The `lambda/test-utils` package provides shared testing utilities for all lambdas and layers:

### Mocks

```typescript
import { mockDatabase, mockResponse, mockLogger } from '../../test-utils/src';

// Mock database operations
mockDatabase.getItem.mockResolvedValue({ id: 'test', name: 'Test' });

// Mock responses
mockResponse.lambdaSuccess.mockReturnValue({ success: true, data: {} });
```

### Factory Functions

```typescript
import {
  createMockEvent,
  createMockProduct,
  createMockUser,
  createMockOrder,
} from '../../test-utils/src';

const event = createMockEvent('getProduct', { id: 'prod-1' });
const product = createMockProduct({ price: 29.99 });
const user = createMockUser({ role: 'ADMIN' });
```

### Setup Utilities

```typescript
import {
  setupTestEnvironment,
  suppressConsoleOutput,
  resetAllMocks,
} from '../../test-utils/src';

beforeEach(() => {
  resetAllMocks();
});
```

## 🎯 Test Organization

### Infrastructure Tests (`test/`)

Tests for CDK constructs, stacks, and infrastructure configuration.

#### Detailed Assertion Tests (`ecommerce-infrastructure-stack.test.ts`)

Specific, readable tests for infrastructure resources:

- ✅ **VPC Configuration**: Subnets, routing, security groups
- ✅ **DynamoDB Tables**: Products, Users, Orders with GSIs
- ✅ **S3 Buckets**: Configuration, policies, lifecycle
- ✅ **Lambda Functions**: Runtime, environment, permissions
- ✅ **AppSync GraphQL**: API, resolvers, data sources
- ✅ **WAF Protection**: Rate limiting, SQL injection rules
- ✅ **CloudWatch**: Monitoring, logging, dashboards
- ✅ **IAM Permissions**: Least privilege access control
- ✅ **Outputs**: Resource exports and descriptions
- ✅ **Tags**: Consistent resource tagging

#### Snapshot Tests (`cdk-snapshot.test.ts`)

Regression detection for the entire CloudFormation template:

- ✅ **Single comprehensive snapshot**: Captures complete infrastructure
- ✅ **Detects unintended changes**: Alerts on any infrastructure modifications
- ✅ **Update when intentional**: `pnpm run test:snapshot:update`

**Note**: The snapshot test complements the detailed tests by catching unexpected changes. If it fails, review the changes and update the snapshot if they are intentional.

### Lambda Function Tests

Each lambda function has its own test directory:

- ✅ **CRUD Operations**: Create, Read, Update, Delete
- ✅ **Validation**: Input validation and error handling
- ✅ **Business Logic**: Operation-specific logic
- ✅ **Error Handling**: Graceful error management
- ✅ **Integration**: Database and external service interactions

### Lambda Layer Tests

Layer tests cover shared utilities:

- ✅ **Database Utilities**: CRUD operations, queries, scans
- ✅ **Response Utilities**: Success/error response formatting
- ✅ **Error Handling**: Consistent error management
- ✅ **Type Safety**: TypeScript interface validation

## 📝 Writing Tests

### Lambda Function Test Example

```typescript
import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import {
  mockDatabase,
  mockResponse,
  createMockEvent,
  createMockProduct,
  resetAllMocks,
} from '../../../test-utils/src';

jest.mock('../../../layers/nodejs/src/database', () => mockDatabase);
jest.mock('../../../layers/nodejs/src/response', () => mockResponse);

describe('Products Lambda', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  it('should get a product', async () => {
    const mockProduct = createMockProduct({ id: 'prod-1' });
    mockDatabase.getItem.mockResolvedValue(mockProduct);

    const event = createMockEvent('getProduct', { id: 'prod-1' });
    const result = await handler(event);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockProduct);
  });
});
```

### Infrastructure Test Example

```typescript
import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { EcommerceInfrastructureStack } from '../stacks/ecommerce-infrastructure-stack';

describe('EcommerceInfrastructureStack', () => {
  it('should create DynamoDB tables', () => {
    const app = new cdk.App();
    const stack = new EcommerceInfrastructureStack(app, 'TestStack');
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'ProductsTable',
    });
  });
});
```

## 🛠️ Test Configuration

### Root Jest Config

The root `jest.config.js` discovers and runs all tests across the project:

- **infrastructure**: CDK stack tests
- **integration**: Integration tests
- **lambda:orders**: Orders Lambda tests
- **lambda:products**: Products Lambda tests
- **lambda:users**: Users Lambda tests
- **layer:nodejs**: Nodejs layer tests

### Lambda-Specific Configs

Each lambda/layer has its own `jest.config.js`:

- Independent test configuration
- Custom module mappings
- Individual coverage thresholds
- Specific setup files

## 📊 Coverage Thresholds

- **Branches**: 80% (conditional logic coverage)
- **Functions**: 80% (function execution coverage)
- **Lines**: 80% (line-by-line coverage)
- **Statements**: 80% (statement execution coverage)

## 🔧 Best Practices

### Co-location

✅ **DO**: Keep tests close to the code they test

```
lambda/functions/orders/
  ├── src/
  │   └── index.ts
  └── test/
      └── index.test.ts
```

❌ **DON'T**: Put all tests in a centralized location far from code

### Test Independence

✅ **DO**: Each lambda can be tested independently

```bash
cd lambda/functions/orders
pnpm test
```

❌ **DON'T**: Create tight coupling between test suites

### Shared Utilities

✅ **DO**: Use shared test utilities from `lambda/test-utils`

```typescript
import { createMockProduct } from '../../../test-utils/src';
```

❌ **DON'T**: Duplicate mock implementations across tests

### Descriptive Names

✅ **DO**: Use clear, descriptive test names

```typescript
it('should return error when product not found', () => {});
```

❌ **DON'T**: Use vague test names

```typescript
it('test 1', () => {});
```

## 🚨 Common Issues & Solutions

### Import Path Issues

**Problem**: `Cannot resolve module '~/lambda/...'`

**Solution**: Check `moduleNameMapper` in `jest.config.js`:

```javascript
moduleNameMapper: {
  '^~/(.*)$': '<rootDir>/$1',
}
```

### Mock Not Working

**Problem**: Mocks not being applied correctly

**Solution**: Use `resetAllMocks()` in `beforeEach`:

```typescript
beforeEach(() => {
  resetAllMocks();
});
```

### TypeScript Errors in Tests

**Problem**: Type errors in test files

**Solution**: Ensure correct types from `@speira/e-commerce-schema`:

```typescript
import type { GraphQLEvent } from '@speira/e-commerce-schema';
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [TypeScript Testing](https://www.typescriptlang.org/docs/handbook/testing.html)
- [AWS CDK Testing](https://docs.aws.amazon.com/cdk/v2/guide/testing.html)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Shared Test Utils README](../lambda/test-utils/README.md)

## 🎉 Benefits of New Structure

1. **Co-location**: Tests live with the code they test
2. **Independence**: Each lambda can be tested independently
3. **Scalability**: Easy to add new lambdas with their own tests
4. **Clarity**: Clear separation between infrastructure and lambda tests
5. **Reusability**: Shared test utilities reduce duplication
6. **CI/CD**: Can run specific test suites when only certain code changes
7. **Maintainability**: Easier to find and update tests
8. **Developer Experience**: Better organization and faster test execution
