import { Context, Effect, Layer } from 'effect';

import { AppError } from '../error';

import {
  AuthContext,
  requireAdmin,
  requireAuth,
  requireManager,
  requireOwnership,
  requireResourceAccess,
} from './auth';

export interface AuthService {
  readonly requireAuth: (
    event: unknown,
  ) => Effect.Effect<AuthContext, EffectAuthError>;
  readonly requireOwnership: (
    resourceUserId: string,
    context: AuthContext,
  ) => Effect.Effect<void, EffectAuthError>;
  readonly requireResourceAccess: (
    userId: string,
    context: AuthContext,
  ) => Effect.Effect<void, EffectAuthError>;
  readonly requireAdmin: (
    context: AuthContext,
  ) => Effect.Effect<void, EffectAuthError>;
  readonly requireManager: (
    context: AuthContext,
  ) => Effect.Effect<void, EffectAuthError>;
}

export class AuthServiceTag extends Context.Tag('AuthService')<
  AuthServiceTag,
  AuthService
>() {}

export const EFFECT_AUTH_ERROR_TAG = 'EffectAuthError';

export class EffectAuthError {
  readonly _tag = EFFECT_AUTH_ERROR_TAG;
  constructor(
    public readonly message: string,
    public readonly code: 401 | 403 = 401, // 401: Unauthorized, 403: Forbidden
  ) {}
}

/** Convert an auth operation that throws to Effect */
export function authEffectAdaptor<A>(
  operation: () => A,
): Effect.Effect<A, EffectAuthError> {
  return Effect.try({
    try: operation,
    catch: (error) => {
      if (error instanceof AppError)
        return new EffectAuthError(error.message, error.code as 401 | 403);

      return new EffectAuthError(
        error instanceof Error ? error.message : 'Authorization failed',
      );
    },
  });
}

export const AuthServiceLive: Layer.Layer<AuthServiceTag> = Layer.succeed(
  AuthServiceTag,
  AuthServiceTag.of({
    requireAuth: (event) =>
      authEffectAdaptor(() =>
        requireAuth(event as Parameters<typeof requireAuth>[0]),
      ),
    requireOwnership: (resourceUserId, context) =>
      authEffectAdaptor(() => requireOwnership(resourceUserId, context)),
    requireResourceAccess: (userId, context) =>
      authEffectAdaptor(() => requireResourceAccess(userId, context)),
    requireAdmin: (context) => authEffectAdaptor(() => requireAdmin(context)),
    requireManager: (context) =>
      authEffectAdaptor(() => requireManager(context)),
  }),
);
