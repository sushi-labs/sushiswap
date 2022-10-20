const BaseChecker = require('./../base-checker')

const FROBIDDEN_NAMES = ['I', 'l', 'O']

const ruleId = 'use-forbidden-name'
const meta = {
  type: 'naming',

  docs: {
    description: `Avoid to use letters 'I', 'l', 'O' as identifiers.`,
    category: 'Style Guide Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class UseForbiddenNameChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitIdentifier(ctx) {
    const text = ctx.getText()

    if (FROBIDDEN_NAMES.includes(text)) {
      this.error(ctx, "Avoid to use letters 'I', 'l', 'O' as identifiers")
    }
  }
}

module.exports = UseForbiddenNameChecker
