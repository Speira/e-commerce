import type { ClassNameValue } from 'tailwind-merge';

import { getAppTranslations, type NestedTranslationKey } from '~/lib/i18n';
import { cn } from '~/lib/shadcn';

interface TypographyProps
  extends React.HTMLAttributes<
    | HTMLHeadingElement
    | HTMLParagraphElement
    | HTMLSpanElement
    | HTMLQuoteElement
  > {
  label?: NestedTranslationKey;
  before?: React.ReactNode;
  after?: React.ReactNode;
  muted?: boolean;
  as?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'p'
    | 'b'
    | 'span'
    | 'small'
    | 'strong'
    | 'blockquote';
}

/** Typography component to display translations */
export function Typography({
  after,
  as = 'p',
  before,
  className,
  label,
  muted,
  ...props
}: TypographyProps) {
  const t = getAppTranslations();

  const TypographyComponent = as;

  const baseClasses: Record<Required<TypographyProps>['as'], ClassNameValue> = {
    h1: 'scroll-m-20 text-center text-3xl font-bold tracking-tight text-balance',
    h2: 'scroll-m-20 pb-2 text-2xl font-bold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-lg font-semibold tracking-tight',
    p: 'leading-5 text-sm [&:not(:first-child)]:mt-6',
    b: 'font-bold',
    span: 'inline-block text-sm',
    small: 'text-xs leading-none font-medium',
    strong: 'font-semibold',
    blockquote: 'mt-6 border-l-2 pl-6 italic',
  };
  return (
    <TypographyComponent
      className={cn(
        baseClasses[as],
        'flex items-center gap-2',
        muted && 'text-muted-foreground',
        className,
      )}
      {...props}>
      {before}
      {!!label && t(label)}
      {after}
    </TypographyComponent>
  );
}
