// Direct exports for modular monolith pattern
export * as auth from './src/auth';
export * as database from './src/database';
export * as effectUtils from './src/effectUtils';
export * as env from './src/env';
export * as error from './src/error';
export { Logger } from './src/logger';
export * as repositories from './src/repositories';
export * as response from './src/response';

// Export individual error types for convenience
export {
  EffectAppError,
  EffectAuthError,
  EffectDatabaseError,
  EffectRepositoryError,
  EffectValidationError,
} from './src/effectUtils';

// Legacy export for backward compatibility (can be removed later)
import * as auth from './src/auth';
import * as database from './src/database';
import * as effectUtils from './src/effectUtils';
import * as env from './src/env';
import * as error from './src/error';
import { Logger } from './src/logger';
import * as repositories from './src/repositories';
import * as response from './src/response';

export const NodejsLayer = {
  auth,
  database,
  effectUtils,
  env,
  error,
  Logger,
  repositories,
  response,
};
