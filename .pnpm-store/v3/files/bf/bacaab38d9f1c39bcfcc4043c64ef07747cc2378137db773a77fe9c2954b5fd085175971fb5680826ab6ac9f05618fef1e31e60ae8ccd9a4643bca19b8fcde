// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

var globals = {
  'd3-interpolate': 'd3',
};

const config = {
  input: 'index.js',
  plugins: [
    resolve(),
    babel({
      plugins: ['transform-object-assign'],
      exclude: 'node_modules/**', // only transpile our source code
    }),
  ],
  external: Object.keys(globals),
  output: {
    file: `build/d3-interpolate-path.js`,
    name: 'd3',
    format: 'umd',
    indent: false,
    extend: true,
    globals: globals,
  },
};

export default [
  config,
  {
    ...config,
    output: { ...config.output, file: 'docs/d3-interpolate-path.js' },
  },
];
