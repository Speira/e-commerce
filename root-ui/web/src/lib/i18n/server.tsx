import { getTranslations } from 'next-intl/server';

import { AppTranslation } from './types';

export const getAppTranslations = async () => {
  return await getTranslations<AppTranslation>();
};
