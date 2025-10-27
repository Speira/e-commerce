import { useState } from 'react';

import { useMutation } from '@apollo/client/react';

import { Button, Field, LinkButton, Typography } from '~/components';
import K from '~/constants';

import { AuthForm, AuthInput } from './elements';
import { POST_FORGOT_PASSWORD } from './requests';

export function LoginForgotPass() {
  const [email, setEmail] = useState('');

  const [forgotPassword, { loading, data, error }] =
    useMutation(POST_FORGOT_PASSWORD);

  const postAskReset = () => {
    forgotPassword({ variables: { email } });
  };

  return (
    <AuthForm
      onSubmit={postAskReset}
      isLoading={loading}
      title="auth.passwordReset"
      description="auth.passwordResetDescription">
      <AuthInput
        id="email"
        label="auth.email"
        type="email"
        isLoading={loading}
        value={email}
        onChange={(value) => setEmail(value)}
        placeholder="m@example.com"
      />

      <Field orientation="horizontal">
        <LinkButton
          href={K.PATHS.LOGIN}
          variant="outline"
          type="button"
          disabled={loading}>
          <Typography as="span" label="common.back" />
        </LinkButton>
        <Button type="submit" disabled={loading}>
          <Typography as="span" label="auth.resetPassword" />
        </Button>
      </Field>
    </AuthForm>
  );
}
