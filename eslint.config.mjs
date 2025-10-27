// Flat ESLint config for TypeScript + Prettier
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/pnpm-lock.yaml',
      '**/cdk.out/**',
      '**/out/**',
      '**/build/**',
      '**/next-env.d.ts',
      '**/*.log',
      '**/.vscode/**',
      '**/.idea/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // Pas d'analyse de type par défaut au root
        project: false,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
    },
    rules: {
      // Prettier
      'prettier/prettier': ['error'],

      // Core
      // ❌ Désactive la core rule pour éviter le doublon
      'no-unused-vars': 'off',
      // ✅ Utilise uniquement la version TS
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],

      // Import sorting
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react$'],
            ['^react', '^@?\\w'],
            ['^(~)(.*|$)'],
            ['^\\u0000'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.?(css|scss)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
];
