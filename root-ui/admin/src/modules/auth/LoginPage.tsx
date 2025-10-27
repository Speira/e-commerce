import { useState } from 'react';

import { useMutation } from '@apollo/client/react';

import {
  Button,
  Field,
  FieldSeparator,
  LinkButton,
  Typography,
} from '~/components';
import K from '~/constants';

import { AuthForm, AuthInput } from './elements';
import { POST_AUTH_USER } from './requests';

export function LoginPage() {
  const [login, { loading, data, error }] = useMutation(POST_AUTH_USER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const postSignin = () => {
    login({ variables: { email, password } });
  };

  return (
    <AuthForm
      onSubmit={postSignin}
      isLoading={loading}
      title="auth.loginToYourAccount"
      description="auth.emailDescription">
      <AuthInput
        id="email"
        label="auth.email"
        type="email"
        isLoading={loading}
        value={email}
        onChange={(value) => setEmail(value)}
        placeholder="m@example.com"
      />
      <AuthInput
        id="password"
        label="auth.password"
        type="password"
        isLoading={loading}
        value={password}
        onChange={(value) => setPassword(value)}
        placeholder="My password">
        <LinkButton variant="link" tabIndex={-1} href={K.PATHS.FORGOT_PASSWORD}>
          <Typography as="span" label="auth.forgotPassword" muted />
        </LinkButton>
      </AuthInput>

      <Field>
        <Button disabled={loading} type="submit">
          <Typography as="span" label="auth.login" />
        </Button>
        <FieldSeparator className="my-1">
          <Typography as="span" label="auth.loginOther" />
        </FieldSeparator>
        <Button disabled={loading} variant="outline" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          <Typography as="span" label="auth.loginGmail" />
        </Button>
      </Field>
    </AuthForm>
  );
}
