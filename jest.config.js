const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // The test environment that will be used for testing
  testEnvironment: 'jest-environment-jsdom',

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  testPathIgnorePatterns: ['\\\\node_modules\\\\', '<rootDir>/cypress/'],

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['./src/components/**/*.{js,ts,jsx,tsx}', './src/app/**/*.{js,ts,jsx,tsx}'],

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['\\\\node_modules\\\\', 'error.tsx', 'layout.tsx', 'page.tsx'],

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['json', 'html', 'text'],

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/?(*.)+(test).tsx', '**/?(*.)+(test).ts'],

  //Indicates whether each individual test should be reported during the run
  verbose: true,

  modulePaths: ['<rootDir>'],

  moduleNameMapper: {
    uuid: require.resolve('uuid'),
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
