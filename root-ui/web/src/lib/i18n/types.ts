/** Utility to generate TypeScript types from translation JSON files */

import { NestedKeyOf } from 'next-intl';

import enTranslations from './dictionaries/en.json';

type EnglishTranslations = typeof enTranslations;

export type AppTranslation = NestedKeyOf<EnglishTranslations>;

/** Type for specific namespace keys @example TranslationKeyType<'auth'> */
export type TranslationKeyType<T extends keyof EnglishTranslations> =
  NestedKeyOf<EnglishTranslations[T]>;
