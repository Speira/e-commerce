import {
  createRouter,
  RouterProvider as TanStackRouterProvider,
} from '@tanstack/react-router';

import { routeTree } from '~/routeTree.gen';

export const router = createRouter({
  routeTree,
  context: undefined!, // "!" means this will be provided by the RouterProvider
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

type RouterProviderProps = {
  context?: object;
};

export function RouterProvider(props: RouterProviderProps) {
  const { context } = props;
  return <TanStackRouterProvider router={router} context={context} />;
}
