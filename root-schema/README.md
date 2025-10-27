# @speira/e-commerce-schema

Central GraphQL schema and type definitions for the e-commerce application.

## Overview

This package serves as the **single source of truth** for all type definitions across the e-commerce monorepo. It contains:

- GraphQL schema definition
- Auto-generated TypeScript types
- Auto-generated resolver types for Lambda functions
- Auto-generated Zod schemas for runtime validation

## Architecture

```
root-schema/
├── graphql/
│   └── schema.graphql         # GraphQL schema definition (source of truth)
├── codegen/
│   └── codegen.yml            # GraphQL Code Generator configuration
├── generated/
│   ├── base.ts                # Base types (GraphQL events, responses)
│   ├── types.ts               # Generated TypeScript types from GraphQL
│   ├── resolvers.ts           # Generated resolver signatures for Lambdas
│   ├── zod.ts                 # Generated Zod validation schemas
│   └── index.ts               # Main entry point
├── package.json
└── tsconfig.json
```

## Usage

### Installation

This package is automatically linked via pnpm workspace:

```json
{
  "dependencies": {
    "@speira/e-commerce-schema": "workspace:*"
  }
}
```

### Importing Types

```typescript
// Import base types
import { GraphQLEvent, GraphQLResponse } from '@speira/e-commerce-schema';

// Import entity types
import { Product, User, Order } from '@speira/e-commerce-schema';

// Import resolver types
import { Resolvers, QueryResolvers } from '@speira/e-commerce-schema';

// Import validation schemas
import {
  CreateProductInputSchema,
  UpdateOrderInputSchema,
} from '@speira/e-commerce-schema';
```

### Code Generation

Types are automatically generated from the GraphQL schema:

```bash
# Generate types
pnpm run codegen

# Watch mode (regenerates on schema changes)
pnpm run codegen:watch

# Build (alias for codegen)
pnpm run build
```

## Consuming Packages

### root-lib

Uses generated types as base types and adds domain-specific validation logic:

```typescript
import type { Product } from '@speira/e-commerce-schema';
import { z } from 'zod';

// Re-export type
export type { Product };

// Add custom validation
export const ProductSchema = z.object({
  id: z.string().uuid(),
  // ... validation rules
});
```

### Lambda Functions

Import types and validation schemas directly:

```typescript
import {
  GraphQLEvent,
  Product,
  CreateProductInputSchema,
} from '@speira/e-commerce-schema';

export async function handler(event: GraphQLEvent) {
  const input = CreateProductInputSchema.parse(event.arguments.input);
  // ... implementation
}
```

### CDK Infrastructure

Uses types for defining Lambda signatures and AppSync resolvers:

```typescript
import { GraphQLEvent, Product } from '@speira/e-commerce-schema';
```

## Benefits

✅ **Single Source of Truth**: GraphQL schema defines all types  
✅ **Type Safety**: Full TypeScript coverage from schema to database  
✅ **Runtime Validation**: Zod schemas generated from GraphQL  
✅ **Consistency**: Same types used across backend, frontend, and infrastructure  
✅ **Maintainability**: Update schema once, types propagate everywhere  
✅ **Developer Experience**: Auto-complete and type checking across the monorepo

## Development Workflow

1. **Update Schema**: Modify `graphql/schema.graphql`
2. **Regenerate Types**: Run `pnpm run codegen`
3. **Update Consumers**: Changes propagate to all importing packages
4. **Test**: Run tests in consuming packages

## Notes

- This package has **no runtime dependencies** except `zod`
- Generated files should **not be edited manually**
- If you need custom validation, extend types in `root-lib`
- For UI-specific operations, those will be added in future iterations
