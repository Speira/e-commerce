/** Shared test helpers for Orders Lambda tests */
import {
  mockDatabase,
  mockResponse,
  resetAllMocks,
} from '../../../test-utils/src';

// Mock the NodejsLayer module
jest.mock('~/lambda/layers/nodejs', () => ({
  NodejsLayer: {
    database: mockDatabase,
    response: mockResponse,
    Logger: jest.fn().mockImplementation(() => ({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      setContext: jest.fn(),
    })),
  },
}));

/** Common setup for all order tests */
export const setupOrderTests = () => {
  beforeEach(() => {
    resetAllMocks();
    mockResponse.lambdaSuccess.mockImplementation((data: unknown) => ({
      data,
      success: true,
    }));
    mockResponse.lambdaError.mockImplementation((message: string) => ({
      success: false,
      error: { message },
    }));
  });
};

export { mockDatabase, mockResponse };
