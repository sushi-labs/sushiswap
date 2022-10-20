const BaseChecker = require('./../base-checker')

const ruleId = 'func-visibility'
const meta = {
  type: 'security',

  docs: {
    description: `Explicitly mark visibility in function.`,
    category: 'Security Rules',
    examples: {
      good: [
        {
          description: 'Functions explicitly marked with visibility',
          code: require('../../../test/fixtures/security/functions-with-visibility').join('\n')
        }
      ],
      bad: [
        {
          description: 'Functions without explicitly marked visibility',
          code: require('../../../test/fixtures/security/functions-without-visibility').join('\n')
        }
      ]
    }
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class FuncVisibilityChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitModifierList(ctx) {
    const text = ctx.getText()

    const hasInternal = text.includes('internal')
    const hasExternal = text.includes('external')
    const hasPrivate = text.includes('private')
    const hasPublic = text.includes('public')

    if (!hasExternal && !hasInternal && !hasPrivate && !hasPublic) {
      this.warn(ctx, 'Explicitly mark visibility in function')
    }
  }
}

module.exports = FuncVisibilityChecker
