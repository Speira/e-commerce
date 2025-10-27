# Test Utilities

Shared test utilities for Lambda functions and layers in the e-commerce infrastructure.

## 📦 Package Contents

### Mocks (`mocks.ts`)

- `mockDatabase` - Mock DynamoDB operations
- `mockResponse` - Mock Lambda response utilities
- `mockLogger` - Mock logging functionality
- `mockConsole` - Mock console methods
- `createMockNodejsLayer()` - Create complete layer mock
- `resetAllMocks()` - Reset all mocks to defaults

### Factories (`factories.ts`)

- `createMockEvent()` - Create mock GraphQL events
- `createMockProduct()` - Create mock product objects
- `createMockUser()` - Create mock user objects
- `createMockOrder()` - Create mock order objects
- `createMockOrderItem()` - Create mock order item objects
- `createMockProducts()` - Create multiple products
- `createMockUsers()` - Create multiple users
- `createMockOrders()` - Create multiple orders

### Setup (`setup.ts`)

- `setupTestEnvironment()` - Configure test environment variables
- `suppressConsoleOutput()` - Suppress console during tests
- `restoreConsoleOutput()` - Restore console output
- `beforeEachSetup()` - Common beforeEach setup
- `afterEachCleanup()` - Common afterEach cleanup

## 🚀 Usage

### In Lambda Function Tests

```typescript
import { handler } from '../src/index';
import {
  mockDatabase,
  mockResponse,
  createMockEvent,
  createMockProduct,
  resetAllMocks,
} from '../../test-utils/src';

// Mock the layer
jest.mock('~/lambda/layers/nodejs', () => ({
  NodejsLayer: {
    database: mockDatabase,
    response: mockResponse,
  },
}));

describe('Products Lambda', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  it('should get a product', async () => {
    const mockProduct = createMockProduct({ id: 'prod-123' });
    mockDatabase.getItem.mockResolvedValue(mockProduct);

    const event = createMockEvent('getProduct', { id: 'prod-123' });
    const result = await handler(event);

    expect(result.success).toBe(true);
  });
});
```

### In Layer Tests

```typescript
import { getItem, putItem } from '../src/database';
import {
  mockDatabase,
  createMockProduct,
  resetAllMocks,
} from '../../test-utils/src';

describe('Database Layer', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  it('should get an item', async () => {
    const mockProduct = createMockProduct();
    // Test implementation
  });
});
```

## 📝 Best Practices

1. **Always reset mocks** between tests using `resetAllMocks()` or `beforeEachSetup()`
2. **Use factories** for consistent test data
3. **Override defaults** as needed for specific test cases
4. **Mock at the layer boundary** to test lambda logic in isolation
5. **Keep mocks simple** and focused on the interface

## 🔧 Development

### Build

```bash
cd lambda/test-utils
pnpm build
```

### Watch Mode

```bash
pnpm dev
```

## 📚 Type Safety

All utilities are fully typed using TypeScript. The factories use types from `@speira/e-commerce-schema` when available.
