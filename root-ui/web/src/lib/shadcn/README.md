# Shadcn/UI Library

This directory contains the core utilities and configuration for the [shadcn/ui](https://ui.shadcn.com/) component library integration.

## Overview

Shadcn/ui is a collection of reusable components built using Radix UI and Tailwind CSS. This setup provides a modern, accessible, and customizable component system for the e-commerce application.

## Files

### `components.json`

Configuration file for shadcn/ui CLI tool. This file defines:

- **Style**: New York variant (clean, minimal design)
- **Framework**: React Server Components (RSC) enabled
- **TypeScript**: Full TypeScript support
- **Tailwind**: CSS variables enabled with Slate base color
- **Icons**: Lucide React icon library
- **Path Aliases**: Configured for easy imports

### `utils.ts`

Core utility functions:

- **`cn()`**: Combines `clsx` and `tailwind-merge` for conditional class names
  - Merges Tailwind classes intelligently
  - Resolves conflicts (e.g., `p-2 p-4` becomes `p-4`)
  - Supports conditional classes

### `index.ts`

Barrel export file that re-exports all utilities for clean imports.

## Usage

### Class Name Utility

```typescript
import { cn } from '~/lib/shadcn';

// Basic usage
const className = cn('px-4 py-2', 'bg-blue-500');

// Conditional classes
const buttonClass = cn(
  'px-4 py-2 rounded',
  isActive && 'bg-blue-500 text-white',
  isDisabled && 'opacity-50 cursor-not-allowed',
);

// With Tailwind conflicts resolved
const resolved = cn('p-2', 'p-4'); // Result: 'p-4'
```

### Adding New Components

Use the shadcn/ui CLI to add new components:

```bash
# Add a new component
npx shadcn@latest add button

# Add multiple components
npx shadcn@latest add button input label

# List available components
npx shadcn@latest add
```

Components will be automatically added to `~/components/ui/` with proper TypeScript types and Tailwind styling.

## Configuration

### Path Aliases

- `~/components` → `src/components`
- `~/components/ui` → `src/components/ui`
- `~/lib/shadcn` → `src/lib/shadcn`
- `~/hooks` → `src/hooks`

### Style Configuration

- **Base Color**: Slate
- **CSS Variables**: Enabled for theme customization
- **Icon Library**: Lucide React
- **Style Variant**: New York (clean, minimal)

## Available Components

The following shadcn/ui components are available in this project:

- **Navigation**: NavigationMenu, NavigationMenuItem, NavigationMenuLink
- **Forms**: Select, SelectContent, SelectItem, SelectTrigger, SelectValue
- **Layout**: Separator
- **Interactive**: Switch, Label, Slot

## Customization

### Theme Colors

Colors are defined in `src/app/[locale]/globals.css` using CSS variables:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --primary: oklch(0.208 0.042 265.755);
  /* ... more colors */
}
```

### Adding Custom Components

1. Create component in `src/components/ui/`
2. Follow shadcn/ui patterns (use `cn()` utility)
3. Export from `src/components/ui/index.ts`
4. Add to this README

## Best Practices

1. **Always use `cn()` utility** for conditional classes
2. **Follow shadcn/ui patterns** for consistency
3. **Use TypeScript** for all component props
4. **Leverage CSS variables** for theming
5. **Test accessibility** with screen readers
6. **Use semantic HTML** elements

## Dependencies

- `clsx`: Conditional class name utility
- `tailwind-merge`: Intelligent Tailwind class merging
- `@radix-ui/*`: Accessible component primitives
- `lucide-react`: Icon library
- `class-variance-authority`: Component variant management

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
