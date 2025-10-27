/** Environment variable validation and access */

/** Get required environment variable or throw error */
export function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Please ensure it is configured in your Lambda function.`,
    );
  }
  return value;
}

/** Get optional environment variable with default value */
export function getEnvOrDefault(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/** Validate all required environment variables on module load */
export function validateEnvironment(requiredVars: string[]): void {
  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        'Lambda function cannot start without these variables configured.',
    );
  }
}
