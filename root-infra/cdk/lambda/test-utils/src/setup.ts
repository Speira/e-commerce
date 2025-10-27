/** Common test setup utilities for Lambda tests */

/** Sets up environment variables for testing */
export const setupTestEnvironment = () => {
  process.env['AWS_REGION'] = 'eu-west-3';
  process.env['PRODUCTS_TABLE'] = 'test-products-table';
  process.env['USERS_TABLE'] = 'test-users-table';
  process.env['ORDERS_TABLE'] = 'test-orders-table';
  process.env['PRODUCT_BUCKET'] = 'test-product-bucket';
  process.env['USER_BUCKET'] = 'test-user-bucket';
  process.env['NODE_ENV'] = 'test';
};

/** Suppresses console output during tests */
export const suppressConsoleOutput = () => {
  if (process.env.NODE_ENV === 'test') {
    global.console = {
      ...console,
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    };
  }
};

/** Restores console output */
export const restoreConsoleOutput = () => {
  jest.restoreAllMocks();
};

/** Common beforeEach setup */
export const beforeEachSetup = () => {
  jest.clearAllMocks();
};

/** Common afterEach cleanup */
export const afterEachCleanup = () => {
  jest.restoreAllMocks();
};
