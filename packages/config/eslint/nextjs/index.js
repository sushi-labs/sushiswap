// @ts-check
/** @type {import('eslint').ESLint.ConfigData} */
const eslintConfig = {
  root: true,
  extends: ['next', 'turbo', 'prettier'],
  // extends: ["@sushiswap/eslint-config", "turbo", "prettier", "next"],
  // plugins: ["testing-library", "simple-import-sort", "unused-imports"],
  // settings: {
  //   next: {
  //     rootDir: ["apps/*/", "packages/*/"],
  //   },
  // },
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
  // rules: {
  //   "@next/next/no-html-link-for-pages": "warn",
  //   "react/display-name": "warn",
  //   "testing-library/prefer-screen-queries": "warn",
  //   "turbo/no-undeclared-env-vars": "warn",
  // },
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
