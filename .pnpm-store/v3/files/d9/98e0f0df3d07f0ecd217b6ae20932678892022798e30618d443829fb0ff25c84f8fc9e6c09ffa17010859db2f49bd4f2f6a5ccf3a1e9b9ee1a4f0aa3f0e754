const BaseChecker = require('./../base-checker')

const ruleId = 'avoid-suicide'
const meta = {
  type: 'security',

  docs: {
    description: `Use "selfdestruct" instead of deprecated "suicide".`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class AvoidSuicideChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitIdentifier(ctx) {
    const identifier = ctx.Identifier().toString()

    if (identifier === 'suicide') {
      this.error(ctx, 'Use "selfdestruct" instead of deprecated "suicide"')
    }
  }
}

module.exports = AvoidSuicideChecker
