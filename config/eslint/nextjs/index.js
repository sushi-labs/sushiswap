// @ts-check
/** @type {import('eslint').ESLint.ConfigData} */
const eslintConfig = {
  extends: ['@sushiswap/eslint-config', 'next/core-web-vitals'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'examples/*/', 'packages/*/'],
    },
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'warn',
  },
}

module.exports = eslintConfig
