import { Context, Effect, Layer } from 'effect';

import {
  batchGetItems,
  executeTransaction,
  getItem,
  putItem,
} from './commands';
import { PutItemOptions } from './types';
import { generateId } from './utils';

export class DatabaseServiceTag extends Context.Tag('DatabaseService')<
  DatabaseServiceTag,
  DatabaseService
>() {}

export class EffectDatabaseError {
  readonly _tag = 'EffectDatabaseError';
  constructor(
    public readonly message: string,
    public readonly cause?: unknown,
  ) {}
}

export interface DatabaseService {
  readonly getItem: <T>(
    tableName: string,
    key: Record<string, unknown>,
  ) => Effect.Effect<T | null, EffectDatabaseError>;
  readonly putItem: <T extends Record<string, unknown>>(
    tableName: string,
    item: T,
    options?: PutItemOptions,
  ) => Effect.Effect<void, EffectDatabaseError>;
  readonly batchGetItems: <T>(
    tableName: string,
    keys: Record<string, unknown>[],
  ) => Effect.Effect<T[], EffectDatabaseError>;
  readonly executeTransaction: (
    transactItems: Parameters<typeof executeTransaction>[0],
  ) => Effect.Effect<void, EffectDatabaseError>;
  readonly generateId: () => string;
}

export function databaseEffectAdaptor<T>(
  promise: () => Promise<T>,
): Effect.Effect<T, EffectDatabaseError> {
  return Effect.tryPromise({
    try: promise,
    catch: (error) => {
      return new EffectDatabaseError(
        error instanceof Error ? error.message : 'Database operation failed',
        error,
      );
    },
  });
}

export const DatabaseServiceLive: Layer.Layer<DatabaseServiceTag> =
  Layer.succeed(
    DatabaseServiceTag,
    DatabaseServiceTag.of({
      getItem: <T>(tableName: string, key: Record<string, unknown>) =>
        databaseEffectAdaptor(() => getItem<T>(tableName, key)),
      putItem: <T extends Record<string, unknown>>(
        tableName: string,
        item: T,
        options?: PutItemOptions,
      ) => databaseEffectAdaptor(() => putItem(tableName, item, options)),

      batchGetItems: <T>(tableName: string, keys: Record<string, unknown>[]) =>
        databaseEffectAdaptor(() => batchGetItems<T>(tableName, keys)),

      executeTransaction: (
        transactItems: Parameters<typeof executeTransaction>[0],
      ) => databaseEffectAdaptor(() => executeTransaction(transactItems)),

      generateId,
    }),
  );
