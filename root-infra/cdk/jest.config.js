export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'esnext',
          target: 'es2022',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  modulePathIgnorePatterns: [
    '<rootDir>/cdk.out/',
    '<rootDir>/.tmp/',
    '<rootDir>/dist/',
    '<rootDir>/lambda/**/node_modules/',
  ],
  projects: [
    // Infrastructure tests (CDK stack tests)
    {
      preset: 'ts-jest',
      displayName: 'infrastructure',
      testMatch: [
        '<rootDir>/test/**/*.test.ts',
        '!<rootDir>/test/integration/**',
      ],
      testEnvironment: 'node',
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            useESM: true,
            tsconfig: {
              module: 'esnext',
              target: 'es2022',
            },
          },
        ],
      },
      extensionsToTreatAsEsm: ['.ts'],
      moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/$1',
      },
      modulePathIgnorePatterns: [
        '<rootDir>/cdk.out/',
        '<rootDir>/.tmp/',
        '<rootDir>/dist/',
      ],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
    // Integration tests
    {
      preset: 'ts-jest',
      displayName: 'integration',
      testMatch: ['<rootDir>/test/integration/**/*.test.ts'],
      testEnvironment: 'node',
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            useESM: true,
            tsconfig: {
              module: 'esnext',
              target: 'es2022',
            },
          },
        ],
      },
      extensionsToTreatAsEsm: ['.ts'],
      moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/$1',
      },
      modulePathIgnorePatterns: [
        '<rootDir>/cdk.out/',
        '<rootDir>/.tmp/',
        '<rootDir>/dist/',
      ],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
    // Lambda function tests (Orders)
    {
      preset: 'ts-jest',
      displayName: 'lambda:orders',
      testMatch: ['<rootDir>/lambda/functions/orders/test/**/*.test.ts'],
      testEnvironment: 'node',
      roots: ['<rootDir>/lambda/functions/orders/test'],
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            useESM: true,
            tsconfig: {
              module: 'esnext',
              target: 'es2022',
            },
          },
        ],
      },
      extensionsToTreatAsEsm: ['.ts'],
      moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/$1',
      },
      modulePathIgnorePatterns: ['<rootDir>/lambda/functions/orders/dist/'],
      setupFilesAfterEnv: ['<rootDir>/lambda/functions/orders/test/setup.ts'],
    },
    // Lambda function tests (Products)
    {
      preset: 'ts-jest',
      displayName: 'lambda:products',
      testMatch: ['<rootDir>/lambda/functions/products/test/**/*.test.ts'],
      testEnvironment: 'node',
      roots: ['<rootDir>/lambda/functions/products/test'],
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            useESM: true,
            tsconfig: {
              module: 'esnext',
              target: 'es2022',
            },
          },
        ],
      },
      extensionsToTreatAsEsm: ['.ts'],
      moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/$1',
      },
      modulePathIgnorePatterns: ['<rootDir>/lambda/functions/products/dist/'],
      setupFilesAfterEnv: ['<rootDir>/lambda/functions/products/test/setup.ts'],
    },
    // Lambda function tests (Users)
    {
      preset: 'ts-jest',
      displayName: 'lambda:users',
      testMatch: ['<rootDir>/lambda/functions/users/test/**/*.test.ts'],
      testEnvironment: 'node',
      roots: ['<rootDir>/lambda/functions/users/test'],
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            useESM: true,
            tsconfig: {
              module: 'esnext',
              target: 'es2022',
            },
          },
        ],
      },
      extensionsToTreatAsEsm: ['.ts'],
      moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/$1',
      },
      modulePathIgnorePatterns: ['<rootDir>/lambda/functions/users/dist/'],
      setupFilesAfterEnv: ['<rootDir>/lambda/functions/users/test/setup.ts'],
    },
    // Lambda layer tests (Nodejs)
    {
      preset: 'ts-jest',
      displayName: 'layer:nodejs',
      testMatch: ['<rootDir>/lambda/layers/nodejs/test/**/*.test.ts'],
      testEnvironment: 'node',
      roots: ['<rootDir>/lambda/layers/nodejs/test'],
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            useESM: true,
            tsconfig: {
              module: 'esnext',
              target: 'es2022',
            },
          },
        ],
      },
      extensionsToTreatAsEsm: ['.ts'],
      moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/$1',
      },
      modulePathIgnorePatterns: ['<rootDir>/lambda/layers/nodejs/dist/'],
      setupFilesAfterEnv: ['<rootDir>/lambda/layers/nodejs/test/setup.ts'],
    },
  ],
  collectCoverageFrom: [
    'lambda/**/*.ts',
    'lib/**/*.ts',
    'stacks/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/*.test.ts',
    '!**/test/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
