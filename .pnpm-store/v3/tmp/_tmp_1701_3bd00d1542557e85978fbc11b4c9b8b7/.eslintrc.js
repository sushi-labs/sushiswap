module.exports = {
	env: {
		es6: true,
		node: true,
	},

	plugins: ['import'],
	extends: [
		'eslint:recommended',
		'plugin:import/errors',
		'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
	],

	parserOptions: {
		ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript featuress
	},

	rules: {
		indent: [2, 'tab'],
		quotes: ['error', 'single'],
		'import/no-unresolved': [2, { commonjs: true }],
		'no-undef': 2,
		'prefer-const': 2,
		semi: ['error', 'always'],
		'no-console': 0,
	},
};
