import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';

import { LoginPage } from '~/modules/auth';

export const Route = createFileRoute('/auth/login')({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === 'string' ? s.redirect : '/',
  }),

  component: AuthLogin,
});

function AuthLogin() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const { auth } = Route.useRouteContext();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // …do real auth (fetch) here…
    await auth.login('fake-jwt-token');

    navigate({
      to: redirect, // absolute URL works, TanStack normalizes i
      replace: true,
    });
  }

  return (
    <>
      <Outlet />
      <LoginPage />
    </>
  );
}
