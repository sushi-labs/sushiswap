const BaseChecker = require('./../base-checker')
const naming = require('./../../common/identifier-naming')

const ruleId = 'modifier-name-mixedcase'
const meta = {
  type: 'naming',

  docs: {
    description: 'Modifier name must be in mixedCase.',
    category: 'Style Guide Rules'
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: []
}

class ModifierNameMixedcase extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitModifierDefinition(ctx) {
    const identifier = ctx.children[1]
    const text = identifier.getText()

    if (naming.isNotMixedCase(text)) {
      this.error(ctx, 'Modifier name must be in mixedCase')
    }
  }
}

module.exports = ModifierNameMixedcase
