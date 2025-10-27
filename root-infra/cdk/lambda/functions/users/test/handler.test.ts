import type { GraphQLEvent } from '@speira/e-commerce-schema';
import { handler } from '../src/index';
import { createMockEvent } from '../../../test-utils/src';
import { mockResponse, setupUserTests } from './test-helpers';

describe('Users Lambda Handler', () => {
  setupUserTests();

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
