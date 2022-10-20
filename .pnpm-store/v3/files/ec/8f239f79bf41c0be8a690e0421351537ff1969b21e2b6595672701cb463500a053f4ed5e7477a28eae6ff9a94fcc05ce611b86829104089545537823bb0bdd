const BaseChecker = require('./../base-checker')

const ruleId = 'compiler-gt-0_4'
const meta = {
  type: 'security',

  docs: {
    description: `Compiler version must be fixed.`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  deprecated: true,

  schema: []
}

class CompilerGT04Checker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitVersionConstraint(ctx) {
    const versionNode =
      (this.isVersionOperator(ctx.children[0]) && ctx.children[1]) || ctx.children[0]

    if (versionNode.getText() < '0.4') {
      this.error(ctx, "Use at least '0.4' compiler version")
    }
  }

  isVersionOperator(ctx) {
    return ctx.constructor.name.includes('VersionOperator')
  }
}

module.exports = CompilerGT04Checker
