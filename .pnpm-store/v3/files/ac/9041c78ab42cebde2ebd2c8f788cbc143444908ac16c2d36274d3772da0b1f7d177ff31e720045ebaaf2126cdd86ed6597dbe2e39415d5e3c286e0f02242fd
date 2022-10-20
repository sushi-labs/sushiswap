const BaseChecker = require('./../base-checker')

const ruleId = 'compiler-fixed'
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

class CompilerFixedChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitVersionOperator(ctx) {
    this.warn(ctx, 'Compiler version must be fixed')
  }
}

module.exports = CompilerFixedChecker
