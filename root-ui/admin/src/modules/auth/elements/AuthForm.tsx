import type { FormEvent } from 'react';

import { FieldGroup, Typography } from '~/components';
import type { NestedTranslationKey } from '~/lib/i18n';

type AuthFormProps = {
  onSubmit: () => void;
  isLoading: boolean;
  children: React.ReactNode;
  title: NestedTranslationKey;
  description: NestedTranslationKey;
};

export function AuthForm(props: AuthFormProps) {
  const { onSubmit, isLoading, title, description, children } = props;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <Typography as="h2" label={title} />
          <Typography as="p" label={description} muted />
        </div>
        {children}
      </FieldGroup>
    </form>
  );
}
