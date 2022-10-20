const BaseChecker = require('./../base-checker')

const ruleId = 'no-inline-assembly'
const meta = {
  type: 'security',

  docs: {
    description: `Avoid to use inline assembly. It is acceptable only in rare cases.`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class NoInlineAssemblyChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitInlineAssemblyStatement(ctx) {
    this.error(ctx)
  }

  error(ctx) {
    const message = 'Avoid to use inline assembly. It is acceptable only in rare cases'
    this.warn(ctx, message)
  }
}

module.exports = NoInlineAssemblyChecker
