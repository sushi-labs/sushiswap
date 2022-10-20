const BaseChecker = require('./../base-checker')

const ruleId = 'state-visibility'
const meta = {
  type: 'security',

  docs: {
    description: `Explicitly mark visibility of state.`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class StateVisibilityChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitStateVariableDeclaration(ctx) {
    const text = ctx.getText()

    const hasInternal = text.includes('internal')
    const hasPrivate = text.includes('private')
    const hasPublic = text.includes('public')

    if (!hasInternal && !hasPrivate && !hasPublic) {
      this.warn(ctx, 'Explicitly mark visibility of state')
    }
  }
}

module.exports = StateVisibilityChecker
