/**
 * Main exports for @speira/e-commerce-schema package
 *
 * Usage: import type { Product, User, Order } from '@speira/e-commerce-schema';
 * import { CreateProductInputSchema } from '@speira/e-commerce-schema/zod';
 */

// Export all types from types.ts
export * from './types';

// Export resolver types (only what's needed for Lambda implementations)
export type {
  Resolver,
  ResolverFn,
  ResolversParentTypes,
  ResolversTypes,
  ResolverTypeWrapper,
} from './resolvers';

// Export Zod schemas
export * from './zod';

// Export base context and event types
export type {
  AppSyncIdentityCognito,
  AppSyncRequestContext,
  GraphQLContext,
  GraphQLEvent,
} from '../baseSchema';
