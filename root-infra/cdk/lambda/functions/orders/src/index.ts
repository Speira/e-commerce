import { env, error, Logger, response } from '@speira/e-commerce-layer-nodejs';
import { GraphQLEvent } from '@speira/e-commerce-schema';

import {
  createOrder,
  deleteOrder,
  getOrder,
  getOrdersByUser,
  listOrders,
  updateOrder,
} from './operations';

const logger = new Logger('orders-service');

// Validate environment variables on module load
const REQUIRED_ENV_VARS = ['ORDERS_TABLE', 'USERS_TABLE', 'PRODUCTS_TABLE'];
env.validateEnvironment(REQUIRED_ENV_VARS);

/** Orders handler */
export const handler = async (event: GraphQLEvent) => {
  const { fieldName, arguments: args } = event;

  const requestId =
    event.request?.headers?.['x-amzn-trace-id'] ||
    event.request?.headers?.['x-amzn-request-id'] ||
    event.identity?.sub ||
    `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  logger.setContext({
    requestId,
    operation: fieldName,
    userId: event.identity?.sub,
    sourceIp: event.identity?.sourceIp?.[0],
  });

  try {
    switch (fieldName) {
      case 'getOrder':
        return await getOrder(args, event);
      case 'listOrders':
        return await listOrders(args, event);
      case 'getOrdersByUser':
        return await getOrdersByUser(args, event);
      case 'createOrder':
        return await createOrder(args, event);
      case 'updateOrder':
        return await updateOrder(args, event);
      case 'deleteOrder':
        return await deleteOrder(args, event);
      default:
        return response.lambdaError(`Unknown field: ${fieldName}`);
    }
  } catch (err) {
    if (err instanceof error.AppError) {
      if (err.isClientError()) {
        logger.warn('[Orders handler] warning:', {
          operation: fieldName,
          error: err.message,
        });
        // return a 400 error but lambda will be successful
        return response.lambdaError(err.message);
      }
    }
    logger.error('[Orders handler] error:', err as Error, {
      operation: fieldName,
      error: (err as Error).message,
    });
    // return a 500 error and lambda will be failed
    throw err;
  }
};
