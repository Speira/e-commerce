import { Effect, Layer } from 'effect';

import { AuthServiceLive, EffectAuthError } from './auth';
import { DatabaseServiceLive, EffectDatabaseError } from './database';
import {
  APP_ERROR,
  AppError,
  EffectAppError,
  EffectValidationError,
} from './error';
import { EffectRepositoryError, RepositoryServiceLive } from './repositories';

export { AuthServiceTag, EffectAuthError } from './auth';
export { DatabaseServiceTag, EffectDatabaseError } from './database';
export { AppError, EffectAppError, EffectValidationError } from './error';
export { EffectRepositoryError, RepositoryServiceTag } from './repositories';

/** Convert a promise that can throw AppError to Effect */
export function effectAdaptor<A>(
  promise: () => Promise<A>,
): Effect.Effect<A, EffectAppError | EffectDatabaseError> {
  return Effect.tryPromise({
    try: promise,
    catch: (error) => {
      if (error instanceof AppError) return new EffectAppError(error);
      return new EffectAppError(
        new AppError('Unknown error', APP_ERROR.INTERNAL_ERROR),
      );
    },
  });
}

/** Combined live layer with all services */
export const AppServicesLive = Layer.mergeAll(
  DatabaseServiceLive,
  AuthServiceLive,
  RepositoryServiceLive,
);

/** Helper to run an Effect with live services */
export function runWithServices<A, E>(effect: Effect.Effect<A, E>): Promise<A> {
  return Effect.runPromise(Effect.provide(effect, AppServicesLive));
}

/** Convert Effect errors back to AppError for consistent error handling */
export function adaptEffectError(
  error:
    | EffectAppError
    | EffectDatabaseError
    | EffectRepositoryError
    | EffectValidationError
    | EffectAuthError,
): AppError {
  switch (error._tag) {
    case 'EffectAppError':
      return error.error;
    case 'EffectDatabaseError':
      return new AppError(error.message, APP_ERROR.DATABASE_ERROR, error.cause);
    case 'EffectRepositoryError':
      return new AppError(error.message, APP_ERROR.DATABASE_ERROR, error.cause);
    case 'EffectValidationError':
      return new AppError(
        error.message,
        APP_ERROR.VALIDATION_ERROR,
        error.errors,
      );
    case 'EffectAuthError':
      if (error.code === 401) {
        return new AppError(error.message, APP_ERROR.UNAUTHORIZED);
      }
      return new AppError(error.message, APP_ERROR.FORBIDDEN);
  }
}
