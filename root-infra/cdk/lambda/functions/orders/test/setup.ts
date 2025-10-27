/** Test setup for Orders Lambda */
import {
  setupTestEnvironment,
  suppressConsoleOutput,
} from '../../../test-utils/src/setup';

// Setup environment variables
setupTestEnvironment();

// Suppress console output during tests
suppressConsoleOutput();

// Set test timeout
jest.setTimeout(10000);

// Global test cleanup
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});
