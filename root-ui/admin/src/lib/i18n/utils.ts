import { Typeguards } from '@root-lib/base';

import dictionary from './dictionary.json';
import type { EnTranslations, NestedTranslationKey } from './setup';

export const getAppTranslations = () => {
  return function T(key: NestedTranslationKey) {
    const arrayKeys = key.split('.');
    let value = dictionary as EnTranslations;
    const getStringValue: (obj: unknown, keys: string[]) => string = (
      obj: unknown,
      keys: string[],
    ) => {
      if (!Typeguards.checkIsPlainObject(obj)) return '';
      const currentKey = keys[0];
      if (!Typeguards.checkIsString(currentKey)) return '';
      const nextObj = obj[currentKey];
      if (Typeguards.checkIsString(nextObj)) return nextObj;
      if (Typeguards.checkIsPlainObject(nextObj))
        return getStringValue(nextObj, keys.slice(1));
      return '';
    };
    return getStringValue(value, arrayKeys);
  };
};
