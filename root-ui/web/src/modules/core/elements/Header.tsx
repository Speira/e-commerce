import { Link, Typography } from '~/components';

import { HeaderNav } from './HeaderNav';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';

export async function Header() {
  return (
    <header className="bg-secondary text-secondary-foreground grid grid-cols-3 p-4 2xl:px-10">
      <Link href="/">
        <Typography as="h2" label="common.title" />
      </Link>

      <HeaderNav />

      <div className="flex items-center justify-end gap-4">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </header>
  );
}
