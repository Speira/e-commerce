import { LinkButton, Main } from '~/components';
import K from '~/constants';
import { getAppTranslations } from '~/lib/i18n';

export async function NotFound() {
  const t = await getAppTranslations();
  return (
    <Main>
      <h1 className="text-foreground text-6xl font-bold">404</h1>
      <h2 className="text-foreground mt-4 text-2xl font-semibold">
        {t('error.notFound')}
      </h2>
      <p className="text-muted-foreground mt-2">
        {t('error.notFoundDescription')}
      </p>
      <br />
      <LinkButton href={K.PATHS.HOME} variant="default">
        {t('common.back')}
      </LinkButton>
    </Main>
  );
}
