import { Mail, Phone } from 'lucide-react';

import { Link, Typography } from '~/components';
import K from '~/constants';
import { getAppTranslations } from '~/lib/i18n';

export async function Footer() {
  const t = await getAppTranslations();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('common.title')}</h3>
            <Typography
              className="text-muted-foreground mb-4 text-sm"
              as="p"
              label="common.description"
            />
          </div>

          <div>
            <h4 className="mb-4 font-semibold">{t('common.shop')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={K.PATHS.PRODUCTS}>{t('product.title')}</Link>
              </li>
              <li>
                <Link href={K.PATHS.CATEGORIES}>{t('category.title')}</Link>
              </li>
              <li>
                <Link href={K.PATHS.NEW_ARRIVALS}>
                  {t('product.newArrivals')}
                </Link>
              </li>
              <li>
                <Link href={K.PATHS.SALE}>{t('product.sale')}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">{t('common.help')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={K.PATHS.CONTACT}>{t('contact.title')}</Link>
              </li>
              <li>
                <Link href={K.PATHS.FAQ}>{t('common.faq')}</Link>
              </li>
              <li>
                <Link href={K.PATHS.SHIPPING}>{t('order.shipping')}</Link>
              </li>
              <li>
                <Link href={K.PATHS.RETURNS}>{t('order.returns')}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">{t('social.title')}</h4>
            <div className="mb-4 flex gap-4">
              <Link
                href={K.SOCIAL.FACEBOOK}
                target="_blank"
                title={t('social.facebook')}>
                <img
                  height="32"
                  width="32"
                  src="https://unpkg.com/simple-icons/icons/facebook.svg"
                />
              </Link>
              <Link
                href={K.SOCIAL.INSTAGRAM}
                target="_blank"
                title={t('social.instagram')}>
                <img
                  height="32"
                  width="32"
                  src="https://unpkg.com/simple-icons/icons/instagram.svg"
                />
              </Link>
              <Link
                href={K.SOCIAL.X}
                target="_blank"
                title={t('social.twitter')}>
                <img
                  height="32"
                  width="32"
                  src="https://unpkg.com/simple-icons/icons/x.svg"
                />
              </Link>
              <Link
                href={K.SOCIAL.SNAPCHAT}
                target="_blank"
                title={t('social.snapchat')}>
                <img
                  height="32"
                  width="32"
                  src="https://unpkg.com/simple-icons/icons/snapchat.svg"
                />
              </Link>
            </div>
            <div className="text-muted-foreground flex flex-col gap-2 text-sm">
              <Link
                href={`mailto:${K.CONTACT.EMAIL}`}
                className="flex items-center gap-2">
                <Mail size={18} />
                <Typography as="span" before={K.CONTACT.EMAIL} />
              </Link>
              <Link
                href={`tel:${K.CONTACT.PHONE}`}
                className="flex items-center gap-2">
                <Phone size={18} />
                <Typography as="span" before={K.CONTACT.PHONE} />
              </Link>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
          © {new Date().getFullYear()} {t('common.title')}.{' '}
          {t('common.allRightsReserved')}.
        </div>
      </div>
    </footer>
  );
}
