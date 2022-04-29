module.exports = {
  extends: ['next', 'prettier', 'plugin:jsx-a11y/strict'],
  plugins: ['jsx-a11y'],
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
