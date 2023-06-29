// @ts-check
/** @type {import('eslint').ESLint.ConfigData} */
const eslintConfig = {
  extends: ['@sushiswap/eslint-config', 'next'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'warn',
  },
}

module.exports = eslintConfig
