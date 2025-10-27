import type { AnchorHTMLAttributes } from 'react';

import { Button, type ButtonProps } from './ui/button';

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function Link({ children, ...props }: LinkProps) {
  return (
    <a href={props.href} {...props}>
      {children}
    </a>
  );
}

interface LinkButtonProps
  extends ButtonProps,
    Pick<LinkProps, 'href' | 'target'> {
  children: React.ReactNode;
}
export function LinkButton({ href, children, ...props }: LinkButtonProps) {
  return (
    <Button asChild {...props}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
