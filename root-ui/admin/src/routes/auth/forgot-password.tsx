import { createFileRoute } from '@tanstack/react-router';

import { LoginForgotPass } from '~/modules/auth';

export const Route = createFileRoute('/auth/forgot-password')({
  component: AuthForgotPassword,
});

function AuthForgotPassword() {
  return <LoginForgotPass />;
}
