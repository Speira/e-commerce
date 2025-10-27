'use client';
import { Button, LinkButton, Main } from '~/components';
import K from '~/constants';
import { useAppTranslations } from '~/lib/i18n';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function Error({ error, reset }: ErrorProps) {
  const t = useAppTranslations();

  return (
    <Main>
      <h1 className="text-destructive text-6xl font-bold">500</h1>
      <h2 className="text-foreground mt-4 text-2xl font-semibold">
        {t('error.serverError')}
      </h2>
      <p className="text-muted-foreground mt-2 text-center">
        {t('error.serverErrorDescription')}
      </p>
      {process.env.NODE_ENV === 'development' && (
        <pre className="bg-muted mt-4 max-w-2xl overflow-auto rounded-md p-4 text-xs">
          {error.message}
        </pre>
      )}
      <div className="mt-6 flex gap-4">
        <Button onClick={reset} variant="default">
          {t('error.tryAgain')}
        </Button>
        <LinkButton href={K.PATHS.HOME} variant="secondary">
          {t('common.back')}
        </LinkButton>
      </div>
    </Main>
  );
}
