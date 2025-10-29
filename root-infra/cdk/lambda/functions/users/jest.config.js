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
    '^~/lambda/layers/(.*)$': '<rootDir>/../../layers/$1',
    '^~/types$': '<rootDir>/../../../types',
  },
  extensionsToTreatAsEsm: ['.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  collectCoverageFrom: ['src/**/*.ts', '!**/*.d.ts', '!**/node_modules/**'],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};
