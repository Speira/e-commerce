import { Typeguards } from '@speira/e-commerce-lib';

/**
 * Logger class for logging messages to the console.
 *
 * @example
 *   ```ts
 *   const logger = new Logger('my-service');
 *   logger.info('Hello, world!');
 *   ```;
 */
export class Logger {
  private context: Record<string, unknown> = {};

  constructor(private service: string) {}

  setContext(context: Record<string, unknown>) {
    this.context = { ...this.context, ...context };
  }

  private log(level: string, message: string, data?: unknown) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        service: this.service,
        message,
        ...this.context,
        ...(Typeguards.checkIsPlainObject(data) && { data }),
      }),
    );
  }

  info(message: string, data?: unknown) {
    this.log('INFO', message, data);
  }

  error(message: string, error?: Error, data?: unknown) {
    this.log('ERROR', message, {
      ...(Typeguards.checkIsPlainObject(data) && { data }),
      error: {
        message: error?.message,
        stack: error?.stack,
      },
    });
  }

  warn(message: string, data?: unknown) {
    this.log('WARN', message, data);
  }

  debug(message: string, data?: unknown) {
    if (process.env['LOG_LEVEL'] === 'debug') {
      this.log('DEBUG', message, data);
    }
  }
}
