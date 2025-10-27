/** Shared mock implementations for testing Lambda functions and layers */

/** Mock database utilities for DynamoDB operations */
export const mockDatabase = {
  getItem: jest.fn().mockResolvedValue({ id: 'test-id', name: 'Test Item' }),
  putItem: jest.fn().mockResolvedValue({ success: true }),
  queryItems: jest
    .fn()
    .mockResolvedValue([{ id: 'test-id', name: 'Test Item' }]),
  scanItems: jest
    .fn()
    .mockResolvedValue([{ id: 'test-id', name: 'Test Item' }]),
  updateItem: jest.fn().mockResolvedValue({ success: true }),
  deleteItem: jest.fn().mockResolvedValue({ success: true }),
  generateId: jest.fn().mockReturnValue('generated-id-123'),
  addTTL: jest
    .fn()
    .mockReturnValue({ id: 'test-id', name: 'Test Item', ttl: 1234567890 }),
};

/** Mock response utilities for Lambda responses */
export const mockResponse = {
  lambdaSuccess: jest.fn((data: unknown) => ({
    success: true,
    data,
  })),
  lambdaError: jest.fn((errorMsg: string) => ({
    success: false,
    error: { message: errorMsg },
  })),
};

/** Mock logger for suppressing console output in tests */
export const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  setContext: jest.fn(),
};

/** Mock console methods to avoid noise in tests */
export const mockConsole = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

/** Creates a mock NodejsLayer object that matches the layer structure */
export const createMockNodejsLayer = () => ({
  NodejsLayer: {
    database: mockDatabase,
    response: mockResponse,
    Logger: jest.fn().mockImplementation(() => mockLogger),
  },
});

/** Reset all mocks to their initial state */
export const resetAllMocks = () => {
  jest.clearAllMocks();

  // Reset mock implementations to defaults
  mockDatabase.getItem.mockResolvedValue({ id: 'test-id', name: 'Test Item' });
  mockDatabase.putItem.mockResolvedValue({ success: true });
  mockDatabase.queryItems.mockResolvedValue([
    { id: 'test-id', name: 'Test Item' },
  ]);
  mockDatabase.scanItems.mockResolvedValue([
    { id: 'test-id', name: 'Test Item' },
  ]);
  mockDatabase.updateItem.mockResolvedValue({ success: true });
  mockDatabase.deleteItem.mockResolvedValue({ success: true });
  mockDatabase.generateId.mockReturnValue('generated-id-123');

  mockResponse.lambdaSuccess.mockImplementation((data: unknown) => ({
    success: true,
    data,
  }));
  mockResponse.lambdaError.mockImplementation((errorMsg: string) => ({
    success: false,
    error: { message: errorMsg },
  }));
};
