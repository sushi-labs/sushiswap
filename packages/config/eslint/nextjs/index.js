module.exports = {
  extends: ['@sushiswap/eslint-config', 'next'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/display-name': 'off',
  },
}
