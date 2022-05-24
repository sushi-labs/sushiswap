module.exports = {
  extends: ['next', 'prettier'],
  plugins: ['simple-import-sort', 'unused-imports'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
  ignorePatterns: ['**/__tests__/*.test.ts'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/display-name': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': 'off',
  },
}
