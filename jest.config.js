/**
 * @type {jest.InitialOptions}
 */
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/tests/__setup.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  testTimeout: 30000,
  maxWorkers: 2,
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      diagnostics: {
        // During development, updating the integration test can require
        // allowing the app to enter an invalid type state until following
        // typegen.
        warnOnly: !process.env.CI,
      },
      tsconfig: 'tests/tsconfig.json',
      useESM: false,
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@prisma|package-up|escape-string-regexp|get-port|execa|node-fetch)/)'
  ],
  testPathIgnorePatterns: [
    'node_modules/',
    'tests/runtime/scalars.test.ts',
    'tests/runtime/plugins.test.ts', 
    'tests/runtime/ordering.test.ts',
    'tests/runtime/field-resolution.test.ts',
    'tests/runtime/custom-resolver.test.ts',
    'tests/runtime/constraints.test.ts'
  ],
}
