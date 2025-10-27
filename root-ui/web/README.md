# E-Commerce Web Application

A modern, internationalized e-commerce frontend built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with CSS-based configuration
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Code Quality**: ESLint + Prettier with Tailwind plugin

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── [...rest]/     # Catch-all for 404
│   │   ├── error.tsx      # Error boundary
│   │   ├── layout.tsx     # Root layout
│   │   ├── not-found.tsx  # 404 page
│   │   └── page.tsx       # Home page
│   └── global-error.tsx   # Global error boundary
├── components/            # Shared components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility libraries
│   ├── i18n/            # Internationalization setup
│   └── shadcn/          # shadcn/ui utilities
├── modules/              # Feature modules
│   └── core/            # Core app features
│       ├── elements/    # Header, Footer, etc.
│       ├── Error.tsx    # Error component
│       └── NotFound.tsx # 404 component
└── helpers/             # Helper utilities
```

## 🌍 Features

- **Internationalization**: Full support for multiple languages (EN/FR)
- **Dark Mode**: Theme switching with system preference detection
- **Responsive Design**: Mobile-first approach
- **Type Safety**: Fully typed with TypeScript
- **Modern Routing**: Next.js 15 App Router with layouts
- **Error Handling**: Comprehensive error boundaries
- **SEO Ready**: Optimized for search engines

## 🛠️ Development

### Prerequisites

- Node.js 20+
- pnpm 8+

### Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Run the development server:

```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm type-check   # Run TypeScript type checking
pnpm format       # Format code with Prettier
```

## 🎨 Styling

This project uses Tailwind CSS v4 with CSS-based configuration. The theme is defined in `globals.css` with CSS custom properties for easy customization.

### Theme Colors

The color system uses OKLCH color space for better color accuracy:

- Primary, Secondary, Accent colors
- Dark mode support with `.dark` class
- Semantic color tokens (background, foreground, etc.)

## 🌐 Internationalization

The app supports multiple languages using next-intl:

- **Supported locales**: `en` (English), `fr` (French)
- **Default locale**: `en`
- **Routing**: Locale-prefixed URLs (e.g., `/en/products`, `/fr/products`)

### Adding Translations

1. Edit translation files in `src/lib/i18n/dictionaries/`
2. Update type definitions if adding new keys
3. Use translations with `getAppTranslations()` in Server Components

## 🧩 Components

### Core Components

- **Header**: Navigation with language and theme switchers
- **Footer**: Multi-column layout with links and info
- **Error**: Centralized error handling
- **NotFound**: Custom 404 page

### UI Components

Pre-configured shadcn/ui components:

- Button, Card, Form elements
- Navigation Menu
- Select, Switch
- Table, Skeleton
- And more...

## 📦 Module System

The project uses a modular architecture:

- `modules/core/`: Core application features
- `modules/auth/`: Authentication (placeholder)
- `modules/product/`: Product features (placeholder)
- `modules/cart/`: Shopping cart (placeholder)

## 🔧 Configuration

### Next.js Config

- Turbopack enabled for faster builds
- Internationalization routing configured

### TypeScript Config

- Strict mode enabled
- Path aliases configured (`~/*` → `src/*`)

### ESLint & Prettier

- Next.js recommended rules
- Prettier integration with Tailwind plugin
- Format on save enabled

## 🚀 Deployment

The app is configured for easy deployment on Vercel:

1. Push to GitHub
2. Import project on Vercel
3. Deploy with zero configuration

For other platforms, run:

```bash
pnpm build
pnpm start
```

## 📝 Contributing

1. Follow the established code patterns
2. Use TypeScript for all new code
3. Ensure all text is internationalized
4. Run linting and type checking before commits
5. Use conventional commit messages

## 📄 License

[Your License Here]
