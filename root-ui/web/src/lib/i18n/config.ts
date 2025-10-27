export const locales = ['en', 'fr'] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
};

export const defaultLocale: Locale = 'en';

export const checkIsLocale = (locale: string): locale is Locale => {
  return locales.some((l) => l === locale);
};
