/** Shared test helpers for Users Lambda tests */
import {
  mockDatabase,
  mockResponse,
  resetAllMocks,
} from '../../../test-utils/src';

export const DATABASE_MODULE_PATH =
  '../../../lambda/layers/nodejs/src/database';

// Mock the common layer modules
jest.mock('../../../layers/nodejs/src/database', () => mockDatabase);
jest.mock('../../../layers/nodejs/src/response', () => mockResponse);

/** Common setup for all user tests */
export const setupUserTests = () => {
  beforeEach(() => {
    resetAllMocks();
  });
};

export { mockDatabase, mockResponse };
