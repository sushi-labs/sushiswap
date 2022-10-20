const BaseChecker = require('./../base-checker')

const ruleId = 'visibility-modifier-order'
const meta = {
  type: 'order',

  docs: {
    description: `Visibility modifier must be first in list of modifiers.`,
    category: 'Style Guide Rules',
    examples: {
      good: [
        {
          description: 'Visibility modifier placed first',
          code: require('../../../test/fixtures/order/visibility-modifier-first')
        }
      ],
      bad: [
        {
          description: 'Visibility modifier not placed first',
          code: require('../../../test/fixtures/order/visibility-modifier-not-first')
        }
      ]
    }
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class VisibilityModifierOrderChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitModifierList(ctx) {
    if (this.containsVisibilityModifier(ctx)) {
      const firstModifier = ctx.children[0]

      if (!this.containsVisibilityModifier(firstModifier)) {
        this._error(firstModifier)
      }
    }
  }

  containsVisibilityModifier(ctx) {
    const text = ctx.getText()

    const hasInternal = text.includes('internal')
    const hasExternal = text.includes('external')
    const hasPrivate = text.includes('private')
    const hasPublic = text.includes('public')

    return hasExternal || hasInternal || hasPrivate || hasPublic
  }

  _error(ctx) {
    const message = 'Visibility modifier must be first in list of modifiers'
    this.error(ctx, message)
  }
}

module.exports = VisibilityModifierOrderChecker
