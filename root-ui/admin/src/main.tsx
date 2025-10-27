import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { GraphQLProvider } from '~/lib/graphQL';
import { RouterProvider } from '~/lib/tanstack';
import { AuthProvider, useAuth } from '~/modules/auth';

import './index.css';

function App() {
  const auth = useAuth();
  return <RouterProvider context={{ auth }} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GraphQLProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GraphQLProvider>
  </StrictMode>,
);
