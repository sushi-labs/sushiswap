/* globals process */

import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

const environment = process.env.ENV || 'development'
const isDevelopmentEnv = environment === 'development'

export default [
  {
    input: 'lib/udf-compatible-datafeed.js',
    output: {
      name: 'Datafeeds',
      format: 'umd',
      file: 'dist/bundle.js',
    },
    plugins: [
      nodeResolve(),
      !isDevelopmentEnv &&
        terser({
          ecma: 2021,
          output: { inline_script: true },
        }),
    ],
  },
]
