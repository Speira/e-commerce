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

export {
  EffectAppError,
  EffectAuthError,
  EffectDatabaseError,
  EffectRepositoryError,
  EffectValidationError,
} from './src/effectUtils';
