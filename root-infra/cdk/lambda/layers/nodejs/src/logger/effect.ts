import { Context } from 'effect';

import { Logger } from './logger';

export class LoggerServiceTag extends Context.Tag('LoggerService')<
  LoggerServiceTag,
  Logger
>() {}
