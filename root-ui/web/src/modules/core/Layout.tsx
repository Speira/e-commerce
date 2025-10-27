import { PropsWithChildren } from 'react';

import { Footer } from './elements/Footer';
import { Header } from './elements/Header';

export function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
