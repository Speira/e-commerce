# Internationalization (i18n) Library

This directory contains the complete internationalization setup for the e-commerce application using [next-intl](https://next-intl-docs.vercel.app/).

## Overview

The i18n library provides:

- **Multi-language support** (English & French)
- **Type-safe translations** with full TypeScript support
- **Server and client-side** translation utilities
- **Automatic locale detection** and routing
- **SEO-friendly** URL structure with locale prefixes

## Architecture

lib/i18n/
├── config.ts # Locale configuration
├── types.ts # TypeScript type definitions
├── routing.ts # Next.js routing configuration
├── request.ts # Server-side request configuration
├── client.ts # Client-side translation hooks
├── server.ts # Server-side translation utilities
├── navigation.ts # Locale-aware navigation components
├── I18nProvider.tsx # React context provider
├── dictionaries/ # Translation files
│ ├── en.json # English translations
│ └── fr.json # French translations
└── index.ts # Barrel exports

## Configuration

### Supported Locales

- **English (en)** - Default locale
- **French (fr)** - Secondary locale

### URL Structure

- **English**: `/en/products`, `/en/cart`
- **French**: `/fr/products`, `/fr/cart`
- **Default**: `/en/*` (always shows locale in URL)

## Usage

### Server Components

```typescript
import { getAppTranslations } from '~/lib/i18n';

export default async function ProductPage() {
  const t = await getAppTranslations();

  return (
    <div>
      <h1>{t('product.title')}</h1>
      <p>{t('product.description')}</p>
      <button>{t('product.addToCart')}</button>
    </div>
  );
}
```

### Client Components

```typescript
'use client';
import { useAppTranslations } from '~/lib/i18n';

export function ProductCard() {
  const t = useAppTranslations();

  return (
    <div>
      <h2>{t('product.name')}</h2>
      <p>{t('product.price')}</p>
    </div>
  );
}
```

### Navigation

```typescript
import { Link, useRouter, usePathname } from '~/lib/i18n';

// Locale-aware Link component
<Link href="/products">Products</Link>

// Programmatic navigation
const router = useRouter();
const pathname = usePathname();

router.push('/cart'); // Maintains current locale
```

### Language Switching

```typescript
'use client';
import { useRouter, usePathname } from '~/lib/i18n';

function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (locale: string) => {
    router.replace(pathname, { locale });
  };

  return (
    <select onChange={(e) => switchLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="fr">Français</option>
    </select>
  );
}
```

## Translation Structure

### Namespace Organization

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "loading": "Loading..."
  },
  "auth": {
    "login": "Login",
    "logout": "Logout",
    "authError": {
      "invalidCredentials": "Invalid credentials"
    }
  },
  "product": {
    "title": "Products",
    "addToCart": "Add to Cart"
  }
}
```

### Type Safety

The system provides full TypeScript support:

```typescript
// ✅ Valid - autocompletion works
t('auth.login');
t('product.addToCart');
t('auth.authError.invalidCredentials');

// ❌ Invalid - TypeScript error
t('invalid.key');
t('auth.nonexistent');
```

## Files Reference

### `config.ts`

- Defines supported locales
- Provides locale validation utilities
- Sets default locale

### `types.ts`

- Generates TypeScript types from translation files
- Provides namespace-specific type helpers
- Ensures type safety across the application

### `routing.ts`

- Configures Next.js routing for internationalization
- Sets locale prefix strategy
- Defines default locale behavior

### `request.ts`

- Server-side request configuration
- Handles locale detection and message loading
- Integrates with Next.js middleware

### `client.ts`

- Client-side translation hook
- Provides typed `useTranslations` wrapper
- Enables autocompletion in client components

### `server.ts`

- Server-side translation utilities
- Provides typed `getTranslations` wrapper
- Optimized for server components

### `navigation.ts`

- Locale-aware navigation components
- Wraps Next.js navigation APIs
- Maintains locale context during navigation

### `I18nProvider.tsx`

- React context provider for client-side translations
- Validates locale and handles errors
- Integrates with Next.js app structure

## Adding New Translations

### 1. Update Translation Files

Add new keys to both `dictionaries/en.json` and `dictionaries/fr.json`:

```json
// en.json
{
  "newSection": {
    "title": "New Section",
    "description": "This is a new section"
  }
}

// fr.json
{
  "newSection": {
    "title": "Nouvelle Section",
    "description": "Ceci est une nouvelle section"
  }
}
```

### 2. Use in Components

```typescript
const t = await getAppTranslations();
return <h1>{t('newSection.title')}</h1>;
```

### 3. TypeScript Support

Types are automatically generated from the English dictionary, so new keys will be available with autocompletion immediately.

## Adding New Locales

### 1. Update Configuration

```typescript
// config.ts
export const locales = ['en', 'fr', 'es'] as const; // Add Spanish
```

### 2. Create Translation File

```bash
# Create dictionaries/es.json
cp dictionaries/en.json dictionaries/es.json
# Translate the content to Spanish
```

### 3. Update Routing

```typescript
// routing.ts
export const routing = defineRouting({
  locales: ['en', 'fr', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always',
});
```

## Best Practices

### 1. Translation Keys

- Use **descriptive, hierarchical keys**: `auth.login.button`
- Keep **consistent naming**: `title`, `description`, `button`
- Use **camelCase** for nested objects: `authError.invalidCredentials`

### 2. Component Structure

- **Server components**: Use `getAppTranslations()`
- **Client components**: Use `useAppTranslations()`
- **Navigation**: Always use locale-aware `Link` and router

### 3. Performance

- **Lazy load** translations only when needed
- **Use server components** when possible for better performance
- **Cache translations** appropriately

### 4. SEO

- **Always show locale** in URL (`/en/products` not `/products`)
- **Use proper meta tags** for each locale
- **Implement hreflang** for search engines

## Troubleshooting

### Common Issues

1. **Missing translations**: Check both `en.json` and `fr.json` files
2. **Type errors**: Ensure translation keys match the English dictionary
3. **Navigation issues**: Use locale-aware navigation components
4. **Locale not detected**: Check middleware configuration

### Debug Mode

Enable debug logging in development:

```typescript
// I18nProvider.tsx
Logger.warn('I18nProvider', locale); // Already implemented
```

## Dependencies

- `next-intl`: Core internationalization library
- `next`: Next.js framework integration
- Custom logger: Error tracking and debugging

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [TypeScript with next-intl](https://next-intl-docs.vercel.app/usage/typescript)
