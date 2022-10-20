module.exports = {
  parserOptions: {
    ecmaVersion: 8
  },
  env: {
    browser: false,
    node: true,
    commonjs: true,
    es6: true,
    mocha: true
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  rules: {
    'consistent-return': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': ['error', { optionalDependencies: true }],
    'global-require': 'off',
    'no-bitwise': 'off',
    'no-console': 'off',
    'no-continue': 'off',
    'no-else-return': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-restricted-properties': 'off',
    'no-restricted-syntax': 'off',
    'no-use-before-define': ['error', { classes: false, functions: false }],
    'prefer-destructuring': 'off',
    'prefer-template': 'off',

    // this rules were disabled to make it easier to add airbnb-base, but they are good ones; we should re-enable them
    // at some point
    'class-methods-use-this': 'off',
    'guard-for-in': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off'
  }
}
