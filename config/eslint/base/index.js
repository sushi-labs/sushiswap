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
  plugins: ['@typescript-eslint', 'simple-import-sort', 'unused-imports', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'turbo',
  ],
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
    '@typescript-eslint/no-explicit-any': 'off', // rome is enough
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-empty-function': ['warn', { allow: ['private-constructors'] }],
    '@typescript-eslint/no-namespace': 'off',
    'no-unused-vars': 'warn',
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': 'warn',
    'turbo/no-undeclared-env-vars': [
      'warn',
      {
        allowList: [],
      },
    ],
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': 'warn',
  },
}
