// @ts-check
/** @type {import('eslint').ESLint.ConfigData} */
const eslintConfig = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'next',
    'turbo',
    'prettier',
  ],
  plugins: [
    // 'testing-library',
    'prettier',
    'simple-import-sort',
    'unused-imports',
  ],
  // extends: ["@sushiswap/eslint-config", "turbo", "prettier", "next"],
  // plugins: ["testing-library", "simple-import-sort", "unused-imports"],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
  // ignorePatterns: [
  //   "**/dist/**",
  //   "**/.next/**",
  //   "**/node_modules/**",
  //   "**/.graphclient/**",
  //   "**/.mesh/**",
  //   "**/generated/**",
  //   "**/typechain/**",
  //   "**/coverage/**",
  //   "**/exports/**",
  //   "**/playwright-report/**",
  //   "**/__tests__/*.test.ts",
  //   "**/test/*.test.ts",
  // ],
  rules: {
    '@next/next/no-html-link-for-pages': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    'react/display-name': 'warn',
    // 'testing-library/prefer-screen-queries': 'warn',
    'turbo/no-undeclared-env-vars': 'warn',
    'prefer-const': 'warn',
    '@next/next/no-img-element': 'warn',
    '@typescript-eslint/no-empty-interface': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-no-target-blank': 'warn',
  },
  // overrides: [
  //   // Only uses Testing Library lint rules in test files
  //   {
  //     files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  //     extends: ["plugin:testing-library/react"],
  //     rules: {
  //       "testing-library/prefer-screen-queries": "warn",
  //     },
  //   },
  // ],
}

module.exports = eslintConfig
