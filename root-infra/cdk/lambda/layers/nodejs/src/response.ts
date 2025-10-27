import {
  ApiResponse,
  ErrorResponse,
  SuccessResponse,
} from '@speira/e-commerce-schema';

/** Success for http api responses */
export function success<T = unknown>(data: T, statusCode = 200): ApiResponse {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    },
    body: JSON.stringify(response),
  };
}

/** Error for http api responses */
export function error(
  message: string,
  statusCode = 400,
  details?: unknown,
): ApiResponse {
  const response: ErrorResponse = {
    success: false,
    error: {
      message,
      details,
    },
  };

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    },
    body: JSON.stringify(response),
  };
}

/** Success for lambda responses */
export function lambdaSuccess<T = unknown>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

/** Error for lambda responses */
export function lambdaError(message: string, details?: unknown): ErrorResponse {
  return {
    success: false,
    error: {
      message,
      details,
    },
  };
}
