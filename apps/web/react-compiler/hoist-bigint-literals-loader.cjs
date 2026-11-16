const { transformAsync } = require('@babel/core')
const hoistBigIntLiterals = require('./hoist-bigint-literals-plugin.cjs')

// Cheap pre-check so files without bigint literals skip Babel entirely.
const BIGINT_LITERAL = /\b(?:0[xob][\da-f_]+|\d[\d_]*)n\b/i

/**
 * Turbopack loader running `hoist-bigint-literals-plugin.cjs` ahead of
 * React Compiler. See that file for why.
 *
 * @this {{ resourcePath: string, async(): (error: Error | null, code?: string, map?: object | null) => void }}
 * @param {string} source
 * @param {object | undefined} inputSourceMap
 */
function hoistBigIntLiteralsLoader(source, inputSourceMap) {
  const callback = this.async()

  if (!BIGINT_LITERAL.test(source)) {
    callback(null, source, inputSourceMap)
    return
  }

  transformAsync(source, {
    filename: this.resourcePath,
    babelrc: false,
    configFile: false,
    sourceMaps: true,
    inputSourceMap: inputSourceMap || undefined,
    parserOpts: {
      plugins: this.resourcePath.endsWith('.tsx')
        ? ['typescript', 'jsx']
        : ['typescript'],
    },
    generatorOpts: { retainLines: true },
    plugins: [hoistBigIntLiterals],
  }).then(
    (result) => callback(null, result?.code ?? source, result?.map ?? null),
    (error) => callback(error),
  )
}

module.exports = hoistBigIntLiteralsLoader
