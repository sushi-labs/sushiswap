// @ts-check
/** @type {import('eslint').ESLint.ConfigData} */
const eslintConfig = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'simple-import-sort', 'unused-imports'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'turbo'],
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
  ],
  rules: {
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': 'warn',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
  },
}

module.exports = eslintConfig
