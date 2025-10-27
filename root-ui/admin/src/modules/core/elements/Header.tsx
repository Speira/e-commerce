import { SidebarTrigger, Typography } from '~/components';

import { ThemeSwitcher } from './ThemeSwitcher';

export function Header() {
  return (
    <header className="bg-sidebar text-sidebar-foreground flex items-center justify-between p-4 2xl:px-10">
      <SidebarTrigger />
      <Typography as="h4" label="common.title" />
      <ThemeSwitcher />
    </header>
  );
}
