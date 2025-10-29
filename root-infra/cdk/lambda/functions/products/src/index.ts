import { GraphQLEvent } from '@speira/e-commerce-schema';
import { env, response, Logger, error } from '@speira/e-commerce-layer-nodejs';

import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from './operations';

const REQUIRED_ENV_VARS = ['PRODUCTS_TABLE'];
env.validateEnvironment(REQUIRED_ENV_VARS);

const logger = new Logger('products-service');

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

    logger.debug('Full event structure', {
      event: JSON.stringify(event, null, 2),
    });

    const { arguments: args } = event;

    switch (event.fieldName) {
      case 'getProduct':
        return await getProduct(args);
      case 'listProducts':
        return await listProducts(args);
      case 'createProduct':
        return await createProduct(args, event);
      case 'updateProduct':
        return await updateProduct(args, event);
      case 'deleteProduct':
        return await deleteProduct(args, event);
      default:
        return response.lambdaError(`Unknown field: "${event.fieldName}"`);
    }
  } catch (err) {
    if (err instanceof error.AppError) {
      if (err.isClientError()) {
        logger.warn('[Products handler] warning:', {
          operation: event.fieldName,
          error: err.message,
        });
        // return a 400 error but lambda will appear as successful
        return response.lambdaError(err.message);
      }
    }
    logger.error('[Products handler] error:', err as Error, {
      operation: event.fieldName,
      error: (err as Error).message,
    });
    // return a 500 error with lambda failure
    throw err;
  }
};
