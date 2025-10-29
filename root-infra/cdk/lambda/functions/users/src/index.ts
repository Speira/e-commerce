import { env, error, Logger, response } from '@speira/e-commerce-layer-nodejs';
import { GraphQLEvent } from '@speira/e-commerce-schema';

import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from './operations';

const REQUIRED_ENV_VARS = ['USERS_TABLE'];
env.validateEnvironment(REQUIRED_ENV_VARS);

const logger = new Logger('users-service');

export const handler = async (event: GraphQLEvent): Promise<unknown> => {
  try {
    const requestId =
      event.request?.headers?.['x-amzn-trace-id'] ||
      event.request?.headers?.['x-amzn-request-id'] ||
      event.identity?.sub ||
      `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    logger.setContext({
      requestId,
      operation: event.fieldName,
      userId: event.identity?.sub,
      sourceIp: event.identity?.sourceIp?.[0],
    });

    const { arguments: args } = event;

    switch (event.fieldName) {
      case 'getUser':
        return await getUser(args, event);
      case 'listUsers':
        return await listUsers(args, event);
      case 'createUser':
        return await createUser(args, event);
      case 'updateUser':
        return await updateUser(args, event);
      case 'deleteUser':
        return await deleteUser(args, event);
      default:
        return response.lambdaError(`Unknown field: ${event.fieldName}`);
    }
  } catch (err) {
    if (err instanceof error.AppError) {
      if (err.isClientError()) {
        logger.warn('[Users handler] warning:', {
          operation: event.fieldName,
          error: err.message,
        });
        // return a 400 error but lambda will appear as successful
        return response.lambdaError(err.message);
      }
    }
    logger.error('[Users handler] error:', err as Error, {
      operation: event.fieldName,
      error: (err as Error).message,
    });
    // return a 500 error with lambda failure
    throw err;
  }
};
