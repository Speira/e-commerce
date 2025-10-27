import { hasLocale } from 'next-intl';
import { getRequestConfig, GetRequestConfigParams } from 'next-intl/server';

import { routing } from './routing';

const request = getRequestConfig(async (params: GetRequestConfigParams) => {
  const { requestLocale } = params;

  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    messages: (await import(`./dictionaries/${locale}.json`)).default,
    locale,
  };
});

export default request;
