import { HTMLAttributes } from 'react';

import { LinkProps as NextLinkProps } from 'next/link';

import { Link as NextLink } from '~/lib/i18n';

import { Button, type ButtonProps } from './ui/button';

interface LinkProps
  extends HTMLAttributes<HTMLAnchorElement>,
    Omit<NextLinkProps, 'locale'> {
  children: React.ReactNode;
  target?: '_blank' | '_self' | '_parent' | '_top';
}
export function Link({ children, ...props }: LinkProps) {
  return <NextLink {...props}>{children}</NextLink>;
}

interface LinkButtonProps
  extends ButtonProps,
    Pick<LinkProps, 'href' | 'target'> {
  children: React.ReactNode;
}
export function LinkButton({ href, children, ...props }: LinkButtonProps) {
  return (
    <Button asChild {...props}>
      <NextLink href={href}>{children}</NextLink>
    </Button>
  );
}
