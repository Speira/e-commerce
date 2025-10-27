'use client';

import { GlobalError as GlobalErrorComponent } from '~/modules/core';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <GlobalErrorComponent error={error} reset={reset} />
      </body>
    </html>
  );
}
