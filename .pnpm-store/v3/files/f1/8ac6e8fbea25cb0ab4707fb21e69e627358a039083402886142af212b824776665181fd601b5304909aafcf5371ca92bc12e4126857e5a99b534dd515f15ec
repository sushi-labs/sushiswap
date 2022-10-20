const BaseChecker = require('./../base-checker')

const ruleId = 'avoid-throw'
const meta = {
  type: 'security',

  docs: {
    description: `"throw" is deprecated, avoid to use it.`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class AvoidThrowChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitThrowStatement(ctx) {
    this.error(ctx, '"throw" is deprecated, avoid to use it')
  }
}

module.exports = AvoidThrowChecker
