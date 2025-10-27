import { Typeguards } from '@root-lib/base';

import type { AuthUser } from '../types';

export function checkAuthType(obj: unknown): obj is AuthUser {
  if (!Typeguards.checkIsPlainObject(obj)) return false;

  return (
    Typeguards.checkIsKeyof(obj, 'id') &&
    Typeguards.checkIsString(obj['id']) &&
    Typeguards.checkIsKeyof(obj, 'email') &&
    Typeguards.checkIsString(obj['email']) &&
    Typeguards.checkIsKeyof(obj, 'firstName') &&
    Typeguards.checkIsString(obj['firstName']) &&
    Typeguards.checkIsKeyof(obj, 'lastName') &&
    Typeguards.checkIsString(obj['lastName']) &&
    Typeguards.checkIsKeyof(obj, 'role') &&
    Typeguards.checkIsString(obj['role'])
  );
}
