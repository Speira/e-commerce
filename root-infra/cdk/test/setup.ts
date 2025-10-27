// Test setup file for Jest
import * as fs from 'fs';
import * as path from 'path';

// Mock environment variables
process.env['AWS_REGION'] = 'eu-west-3';
process.env['PRODUCTS_TABLE'] = 'test-products-table';
process.env['USERS_TABLE'] = 'test-users-table';
process.env['ORDERS_TABLE'] = 'test-orders-table';
process.env['PRODUCT_BUCKET'] = 'test-product-bucket';
process.env['USER_BUCKET'] = 'test-user-bucket';
process.env['NODE_ENV'] = 'test';

// Set CDK to use local temp directory (like scripts/cdk-wrapper.sh does)
const projectRoot = path.resolve(__dirname, '..');
process.env.TMPDIR = path.join(projectRoot, '.tmp');
process.env['CDK_OUTDIR'] = path.join(projectRoot, 'cdk.out');

// Create the directory if it doesn't exist
if (!fs.existsSync(process.env.TMPDIR)) {
  fs.mkdirSync(process.env.TMPDIR, { recursive: true });
}

// Global test timeout
jest.setTimeout(10000);

// Jest configuration for better cleanup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Restore all mocks after each test
  jest.restoreAllMocks();
});

// Suppress console logs during tests (optional)
if (process.env.NODE_ENV === 'test') {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
}

// Conditionally mock AWS SDK modules (only if they exist)
try {
  require.resolve('@aws-sdk/client-dynamodb');
  jest.mock('@aws-sdk/client-dynamodb');
} catch (e) {
  // Module not available, skip mocking
}

try {
  require.resolve('@aws-sdk/lib-dynamodb');
  jest.mock('@aws-sdk/lib-dynamodb');
} catch (e) {
  // Module not available, skip mocking
}

try {
  require.resolve('@aws-sdk/client-s3');
  jest.mock('@aws-sdk/client-s3');
} catch (e) {
  // Module not available, skip mocking
}

// Setup global test utilities
global.testUtils = {
  createMockEvent: (fieldName: string, eventArgs: unknown = {}) => ({
    arguments: eventArgs,
    fieldName,
    identity: null,
    source: null,
    request: null,
    prev: null,
    info: null,
    selectionSetList: null,
    selectionSetGraphQL: null,
  }),

  createMockProduct: (overrides: unknown = {}) => ({
    id: 'prod-1',
    name: 'Test Product',
    description: 'A test product',
    price: 29.99,
    stock: 10,
    category: 'Electronics',
    imageUrl: 'https://example.com/image.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...(overrides as Record<string, unknown>),
  }),

  createMockUser: (overrides: unknown = {}) => ({
    id: 'user-1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'CUSTOMER',
    phone: '+1234567890',
    address: '123 Main St',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...(overrides as Record<string, unknown>),
  }),

  createMockOrder: (overrides: unknown = {}) => ({
    id: 'order-1',
    userId: 'user-1',
    status: 'PENDING',
    total: 59.98,
    shippingAddress: '123 Main St, City, State',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        quantity: 2,
        price: 29.99,
        createdAt: '2024-01-01T00:00:00Z',
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...(overrides as Record<string, unknown>),
  }),
};

// Type declarations for global test utilities
declare global {
  namespace NodeJS {
    interface Global {
      testUtils: {
        createMockEvent: (fieldName: string, eventArgs?: unknown) => unknown;
        createMockProduct: (overrides?: unknown) => unknown;
        createMockUser: (overrides?: unknown) => unknown;
        createMockOrder: (overrides?: unknown) => unknown;
      };
    }
  }

  var testUtils: {
    createMockEvent: (fieldName: string, eventArgs?: unknown) => unknown;
    createMockProduct: (overrides?: unknown) => unknown;
    createMockUser: (overrides?: unknown) => unknown;
    createMockOrder: (overrides?: unknown) => unknown;
  };
}
