export const APP_ERROR = {
  BAD_REQUEST: { CODE: 400, MESSAGE: 'Bad request' },
  VALIDATION_ERROR: { CODE: 400, MESSAGE: 'Validation error' },
  NOT_FOUND: { CODE: 404, MESSAGE: 'Not found' },
  UNAUTHORIZED: { CODE: 401, MESSAGE: 'Unauthorized' },
  FORBIDDEN: { CODE: 403, MESSAGE: 'Forbidden' },
  CONFLICT: { CODE: 409, MESSAGE: 'Conflict' },
  INTERNAL_ERROR: { CODE: 500, MESSAGE: 'Internal error' },
  DATABASE_ERROR: { CODE: 500, MESSAGE: 'Database error' },
  EXTERNAL_SERVICE_ERROR: { CODE: 500, MESSAGE: 'External service error' },
} as const;

/** AppError class for handling application errors */
export class AppError extends Error {
  public code: number;
  public type: string;

  constructor(
    message: string,
    error: (typeof APP_ERROR)[keyof typeof APP_ERROR],
    public details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
    this.code = error.CODE;
    this.type = error.MESSAGE;
  }

  public readonly isServerError = () => {
    return this.code >= 500;
  };

  public readonly isClientError = () => {
    return this.code < 500;
  };
}

export const badRequest = (message: string, details?: unknown) =>
  new AppError(message, APP_ERROR.BAD_REQUEST, details);
export const validationError = (message: string, details?: unknown) =>
  new AppError(message, APP_ERROR.VALIDATION_ERROR, details);
export const notFound = (message: string, details?: unknown) =>
  new AppError(message, APP_ERROR.NOT_FOUND, details);
export const unauthorized = (message: string, details?: unknown) =>
  new AppError(message, APP_ERROR.UNAUTHORIZED, details);
export const forbidden = (message: string, details?: unknown) =>
  new AppError(message, APP_ERROR.FORBIDDEN, details);
export const conflict = (message: string, details?: unknown) =>
  new AppError(message, APP_ERROR.CONFLICT, details);
export const internalError = (message: string, details?: unknown) =>
  new AppError(message, APP_ERROR.INTERNAL_ERROR, details);
export const databaseError = (message: string, details?: unknown) =>
  new AppError(message, APP_ERROR.DATABASE_ERROR, details);
export const externalServiceError = (message: string, details?: unknown) =>
  new AppError(message, APP_ERROR.EXTERNAL_SERVICE_ERROR, details);
