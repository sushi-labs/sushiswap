// @ts-check
/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    // 'testing-library',
    'simple-import-sort',
    'unused-imports',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'next',
    'prettier',
    'turbo',
  ],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
  ignorePatterns: [
    '**/__tests__/*.test.ts',
    '**/dist/**',
    '**/node_modules/**',
    '**/.graphclient/**',
    '**/.mesh/**',
    '**/generated/**',
    '**/typechain/**',
    '**/coverage/**',
    '**/exports/**',
    '**/playwright-report/**',
  ],
  rules: {
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': 'warn',
    'no-unused-vars': 'warn',
    // 'testing-library/prefer-screen-queries': 'warn',
    'turbo/no-undeclared-env-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-namespace': 'off',
  },
  overrides: [
    // Only uses Testing Library lint rules in test files
    // {
    //   files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    //   extends: ['plugin:testing-library/react'],
    //   rules: {
    //     'testing-library/prefer-screen-queries': 'warn',
    //   },
    // },
  ],
}
