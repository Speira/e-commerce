import type { GraphQLEvent } from '@speira/e-commerce-schema';

import { createMockEvent } from '../../../test-utils/src';
import { handler } from '../src/index';

import { mockResponse, setupOrderTests } from './test-helpers';

describe('Orders Lambda Handler', () => {
  setupOrderTests();

  describe('unknown operation', () => {
    it('should return error for unknown GraphQL operation', async () => {
      const event: GraphQLEvent = createMockEvent('unknownOperation', {});

      const result = await handler(event);

      expect(mockResponse.lambdaError).toHaveBeenCalledWith(
        'Unknown operation: unknownOperation',
      );
      expect(result).toEqual({
        success: false,
        error: 'Unknown operation: unknownOperation',
      });
    });
  });
});
