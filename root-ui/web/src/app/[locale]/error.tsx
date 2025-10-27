'use client';

import { useEffect } from 'react';

import { Logger } from '~/lib/logger';
import { Error } from '~/modules/core';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Logger.error(error);
  }, [error]);

  return <Error error={error} reset={reset} />;
}
