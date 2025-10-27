import { LinkButton } from '~/components';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '~/components/ui/navigation-menu';
import { getAppTranslations } from '~/lib/i18n';

export async function HeaderNav() {
  const t = await getAppTranslations();

  const navItems = [
    { href: '/', label: t('home.title') },
    { href: '/products', label: t('product.title') },
    { href: '/cart', label: t('cart.title') },
    { href: '/orders', label: t('order.title') },
  ];

  return (
    <NavigationMenu className="justify-self-center">
      <NavigationMenuList>
        {navItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <LinkButton href={item.href} variant="link">
              {item.label}
            </LinkButton>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
