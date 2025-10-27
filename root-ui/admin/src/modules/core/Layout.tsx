import {
  DollarSign,
  Home,
  Inbox,
  Settings,
  Shirt,
  Truck,
  Users2,
} from 'lucide-react';

import { SidebarProvider } from '~/components';
import K from '~/constants';

import { AppSidebar } from './elements/Sidebar';
import { Footer, Header, Main } from './elements';

const SIDEBAR_ITEMS = [
  {
    title: 'Home',
    url: K.PATHS.HOME,
    icon: Home,
  },
  {
    title: 'Inbox',
    url: K.PATHS.INBOX,
    icon: Inbox,
  },
  {
    title: 'Budget',
    url: K.PATHS.BUDGET,
    icon: DollarSign,
  },
  {
    title: 'Articles',
    url: K.PATHS.ARTICLES,
    icon: Shirt,
  },
  {
    title: 'Orders',
    url: K.PATHS.ORDERS,
    icon: Truck,
  },
  {
    title: 'Users',
    url: K.PATHS.USERS,
    icon: Users2,
  },
  {
    title: 'Settings',
    url: K.PATHS.SETTINGS,
    icon: Settings,
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar items={SIDEBAR_ITEMS} />
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <Main>{children}</Main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
