'use client';

import { useTranslations } from 'next-intl';

import { AppTranslation } from './types';

export const useAppTranslations = () => {
  return useTranslations<AppTranslation>();
};
