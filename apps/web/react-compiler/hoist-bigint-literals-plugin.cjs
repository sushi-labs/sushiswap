/**
 * Moves bigint literals used inside functions (`0n`, `10n ** 18n`, …) to
 * module-level constants.
 *
 * React Compiler cannot lower `BigIntLiteral` expressions and silently skips
 * any component or hook that contains one, leaving it unmemoized. A
 * module-level constant is just a global reference to the compiler, so the
 * function compiles normally. Runtime values are unchanged.
 *
 * Upstream: https://github.com/facebook/react/pull/32305 (closed, unmerged).
 * Remove this plugin once the compiler supports bigint literals.
 *
 * The rewrite runs in `pre`, which Babel calls for every plugin before any
 * visitor runs, so it happens before React Compiler's `Program` visitor even
 * though Next.js orders custom plugins after the compiler.
 *
 * @param {typeof import('@babel/core')} babel
 * @returns {import('@babel/core').PluginObj}
 */
function hoistBigIntLiterals({ types: t }) {
  return {
    name: 'hoist-bigint-literals',
    pre(file) {
      const program = file.path
      /** @type {Map<string, import('@babel/core').types.Identifier>} */
      const hoisted = new Map()

      program.traverse({
        BigIntLiteral(path) {
          if (!path.getFunctionParent()) return
          if (path.parentPath.isTSLiteralType()) return

          const { value } = path.node
          let id = hoisted.get(value)
          if (!id) {
            id = program.scope.generateUidIdentifier('bigint')
            hoisted.set(value, id)
          }
          path.replaceWith(t.identifier(id.name))
        },
      })

      if (hoisted.size === 0) return

      const declaration = t.variableDeclaration(
        'const',
        Array.from(hoisted, ([value, id]) =>
          t.variableDeclarator(id, t.bigIntLiteral(value)),
        ),
      )
      const lastImport = program
        .get('body')
        .filter((statement) => statement.isImportDeclaration())
        .pop()

      if (lastImport) lastImport.insertAfter(declaration)
      else program.unshiftContainer('body', declaration)
    },
  }
}

module.exports = hoistBigIntLiterals
