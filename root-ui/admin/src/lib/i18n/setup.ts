import type { NestedKey } from '@root-lib/base/baseTypes';

import enJson from './dictionary.json';

export type EnTranslations = typeof enJson;

export type NestedTranslationKey = NestedKey<EnTranslations>;
