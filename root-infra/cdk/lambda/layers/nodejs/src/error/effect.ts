import { AppError } from './error';

export const EFFECT_APP_ERROR_TAG = 'EffectAppError';
export const EFFECT_VALIDATION_ERROR_TAG = 'EffectValidationError';

export class EffectAppError {
  readonly _tag = EFFECT_APP_ERROR_TAG;
  constructor(public readonly error: AppError) {}
}

export class EffectValidationError {
  readonly _tag = 'EffectValidationError';
  constructor(
    public readonly message: string,
    public readonly errors?: unknown,
  ) {}
}
