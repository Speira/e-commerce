import type { PropsWithChildren } from 'react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3001/graphql',
    headers: {
      'x-api-key': import.meta.env.VITE_GRAPHQL_API_KEY || '',
    },
  }),
  cache: new InMemoryCache(),
});

export function GraphQLProvider({ children }: PropsWithChildren) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
