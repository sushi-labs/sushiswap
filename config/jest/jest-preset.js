/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
  verbose: true,
  roots: ['<rootDir>'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: [
    '<rootDir>/test/__fixtures__',
    '<rootDir>/node_modules',
    '<rootDir>/dist',
  ],
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
}

module.exports = jestConfig
