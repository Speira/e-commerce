import { error, lambdaError, lambdaSuccess, success } from '../src/response';
import {
  ApiResponse,
  ErrorResponse,
  SuccessResponse,
} from '@speira/e-commerce-schema';

// Helper functions for test expectations
const createExpectedApiResponse = (
  statusCode: number,
  body: object,
): ApiResponse => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  },
  body: JSON.stringify(body),
});

const createExpectedSuccessResponse = (
  data: unknown,
  statusCode: number = 200,
): ApiResponse =>
  createExpectedApiResponse(statusCode, { success: true, data });

const createExpectedErrorResponse = (
  message: string,
  statusCode: number = 400,
  details?: unknown,
): ApiResponse =>
  createExpectedApiResponse(statusCode, {
    success: false,
    error: { message, ...(details !== undefined && { details }) },
  });

describe('Response Utilities', () => {
  describe('success', () => {
    it('should create a success response with default status code', () => {
      const data = { id: 'test-1', name: 'Test Item' };
      const response = success(data);

      expect(response).toEqual(createExpectedSuccessResponse(data));
    });

    it('should create a success response with custom status code', () => {
      const data = { id: 'test-1', name: 'Test Item' };
      const response = success(data, 201);

      expect(response).toEqual(createExpectedSuccessResponse(data, 201));
    });

    it('should handle different data types', () => {
      // String data
      expect(success('test message')).toEqual(
        createExpectedSuccessResponse('test message'),
      );

      // Array data
      expect(success([1, 2, 3])).toEqual(
        createExpectedSuccessResponse([1, 2, 3]),
      );

      // Null data
      expect(success(null)).toEqual(createExpectedSuccessResponse(null));

      // Undefined data
      expect(success(undefined)).toEqual(
        createExpectedSuccessResponse(undefined),
      );
    });
  });

  describe('error', () => {
    it('should create an error response with default status code', () => {
      const message = 'Something went wrong';
      const response = error(message);

      expect(response).toEqual(createExpectedErrorResponse(message));
    });

    it('should create an error response with custom status code', () => {
      const message = 'Not found';
      const response = error(message, 404);

      expect(response).toEqual(createExpectedErrorResponse(message, 404));
    });

    it('should create an error response with details', () => {
      const message = 'Validation failed';
      const details = { field: 'email', reason: 'Invalid format' };
      const response = error(message, 422, details);

      expect(response).toEqual(
        createExpectedErrorResponse(message, 422, details),
      );
    });

    it('should handle different error message types', () => {
      // String message
      expect(error('String error')).toEqual(
        createExpectedErrorResponse('String error'),
      );

      // Error object
      const errorObj = new Error('Error object');
      expect(error(errorObj.message)).toEqual(
        createExpectedErrorResponse('Error object'),
      );

      // Empty string
      expect(error('')).toEqual(createExpectedErrorResponse(''));
    });
  });

  describe('lambdaSuccess', () => {
    it('should create a Lambda success response', () => {
      const data = { id: 'test-1', name: 'Test Item' };
      const response = lambdaSuccess(data);

      expect(response).toEqual({
        success: true,
        data,
      });
    });

    it('should handle different data types', () => {
      // String data
      expect(lambdaSuccess('test message')).toEqual({
        success: true,
        data: 'test message',
      });

      // Array data
      expect(lambdaSuccess([1, 2, 3])).toEqual({
        success: true,
        data: [1, 2, 3],
      });

      // Null data
      expect(lambdaSuccess(null)).toEqual({
        success: true,
        data: null,
      });

      // Object with success property
      const objWithSuccess = { success: false, id: 'test' };
      expect(lambdaSuccess(objWithSuccess)).toEqual({
        success: true,
        data: objWithSuccess,
      });
    });
  });

  describe('lambdaError', () => {
    it('should create a Lambda error response', () => {
      const message = 'Something went wrong';
      const response = lambdaError(message);

      expect(response).toEqual({
        success: false,
        error: { message },
      });
    });

    it('should handle different error message types', () => {
      // String message
      expect(lambdaError('String error')).toEqual({
        success: false,
        error: { message: 'String error' },
      });

      // Error object
      const errorObj = new Error('Error object');
      expect(lambdaError(errorObj.message)).toEqual({
        success: false,
        error: { message: 'Error object' },
      });

      // Empty string
      expect(lambdaError('')).toEqual({
        success: false,
        error: { message: '' },
      });
    });
  });

  describe('Type Definitions', () => {
    it('should have correct ApiResponse type structure', () => {
      // This test ensures the type definitions are correct
      const successResponse: SuccessResponse<string> = {
        success: true,
        data: 'test',
      };

      const errorResponse: ErrorResponse = {
        success: false,
        error: { message: 'test error' },
      };

      // ApiResponse contains the stringified body
      const apiResponse: ApiResponse = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        },
        body: JSON.stringify(successResponse),
      };

      expect(successResponse.success).toBe(true);
      expect(errorResponse.success).toBe(false);
      expect(apiResponse.statusCode).toBe(200);
      expect(JSON.parse(apiResponse.body).success).toBe(true);
    });

    it('should allow ApiResponse to be either success or error', () => {
      // ApiResponse always has the same structure - what varies is the parsed body content
      const responses: ApiResponse[] = [
        {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          },
          body: JSON.stringify({
            success: true,
            data: 'success data',
          }),
        },
        {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          },
          body: JSON.stringify({
            success: false,
            error: {
              message: 'error message',
            },
          }),
        },
      ];

      expect(responses).toHaveLength(2);
      expect(responses[0].statusCode).toBe(200);
      expect(responses[1].statusCode).toBe(400);

      // Check the parsed body content
      const successBody = JSON.parse(responses[0].body);
      const errorBody = JSON.parse(responses[1].body);

      expect(successBody.success).toBe(true);
      expect(successBody.data).toBe('success data');
      expect(errorBody.success).toBe(false);
      expect(errorBody.error.message).toBe('error message');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero status codes', () => {
      const response = success('test', 0);
      expect(response.statusCode).toBe(0);
    });

    it('should handle very large status codes', () => {
      const response = error('test', 999);
      expect(response.statusCode).toBe(999);
    });

    it('should handle special characters in messages', () => {
      const specialMessage =
        'Error with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const response = error(specialMessage);
      expect(response).toEqual(createExpectedErrorResponse(specialMessage));
    });

    it('should handle very long messages', () => {
      const longMessage = 'a'.repeat(1000);
      const response = error(longMessage);
      expect(response).toEqual(createExpectedErrorResponse(longMessage));
    });

    it('should handle empty objects as data', () => {
      const response = success({});
      expect(response).toEqual(createExpectedSuccessResponse({}));
    });

    it('should handle nested objects as data', () => {
      const nestedData = {
        level1: {
          level2: {
            level3: 'deep value',
          },
        },
      };
      const response = success(nestedData);
      expect(response).toEqual(createExpectedSuccessResponse(nestedData));
    });
  });

  describe('Consistency', () => {
    it('should maintain consistent response structure', () => {
      const successResponses = [
        success('data1'),
        success('data2', 201),
        lambdaSuccess('data3'),
      ];

      const errorResponses = [
        error('error1'),
        error('error2', 500),
        lambdaError('error3'),
      ];

      // All success responses should have success: true
      successResponses.forEach((response) => {
        if ('body' in response) {
          // ApiResponse format (success/error functions)
          const body = JSON.parse(response.body);
          expect(body.success).toBe(true);
        } else {
          // Lambda response format (lambdaSuccess/lambdaError functions)
          expect(response.success).toBe(true);
        }
      });

      // All error responses should have success: false
      errorResponses.forEach((response) => {
        if ('body' in response) {
          // ApiResponse format (success/error functions)
          const body = JSON.parse(response.body);
          expect(body.success).toBe(false);
        } else {
          // Lambda response format (lambdaSuccess/lambdaError functions)
          expect(response.success).toBe(false);
        }
      });
    });

    it('should preserve data integrity', () => {
      const originalData = {
        id: 'test-1',
        name: 'Test Item',
        metadata: {
          created: '2024-01-01',
          tags: ['tag1', 'tag2'],
        },
      };

      const response = success(originalData);

      // Data should be exactly the same
      expect(response).toEqual(createExpectedSuccessResponse(originalData));

      // Modifying the response data shouldn't affect the original
      const responseBody = JSON.parse(response.body);
      (
        responseBody.data as { metadata: { tags: string[] } }
      ).metadata.tags.push('tag3');
      expect(originalData.metadata.tags).toEqual(['tag1', 'tag2']);
    });
  });
});
