import { ClassNameValue } from 'tailwind-merge';

import { AppTranslation, getAppTranslations } from '~/lib/i18n';
import { cn } from '~/lib/shadcn';

interface TypographyProps
  extends React.HTMLAttributes<
    | HTMLHeadingElement
    | HTMLParagraphElement
    | HTMLSpanElement
    | HTMLQuoteElement
  > {
  label?: AppTranslation;
  before?: React.ReactNode;
  after?: React.ReactNode;
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
export async function Typography({
  label,
  className,
  as = 'p',
  before,
  after,
  ...props
}: TypographyProps) {
  const t = await getAppTranslations();

  const TypographyComponent = as;

  const baseClasses: Record<Required<TypographyProps>['as'], ClassNameValue> = {
    h1: 'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance',
    h2: 'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    p: 'leading-7 [&:not(:first-child)]:mt-6',
    b: 'font-bold',
    span: 'inline-block text-sm',
    small: 'text-sm leading-none font-medium',
    strong: 'font-semibold',
    blockquote: 'mt-6 border-l-2 pl-6 italic',
  };
  return (
    <TypographyComponent
      className={cn(baseClasses[as], 'flex items-center gap-2', className)}
      {...props}>
      {before}
      {!!label && t(label)}
      {after}
    </TypographyComponent>
  );
}
