module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__test__/**/*.test.ts'],
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
  modulePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  collectCoverageFrom: [
    'base/numberUtils.ts',
    'base/stringUtils.ts',
    'base/objectUtils.ts',
  ],
  coverageThreshold: {
    'base/numberUtils.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    'base/stringUtils.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    'base/objectUtils.ts': {
      branches: 50,
      functions: 100,
      lines: 50,
      statements: 50,
    },
  },
};
