import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import K from '~/constants';
import { Layout } from '~/modules/core';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: K.PATHS.LOGIN,
        search: { redirect: location.href },
      });
    }
  },
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});
