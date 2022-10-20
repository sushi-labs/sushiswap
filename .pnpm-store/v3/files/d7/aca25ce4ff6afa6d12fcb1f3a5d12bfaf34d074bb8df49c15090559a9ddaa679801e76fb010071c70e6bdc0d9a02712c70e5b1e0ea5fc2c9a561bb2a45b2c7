const BaseChecker = require('./../base-checker')
const naming = require('./../../common/identifier-naming')

const ruleId = 'event-name-camelcase'
const meta = {
  type: 'naming',

  docs: {
    description: 'Event name must be in CamelCase.',
    category: 'Style Guide Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class EventNameCamelcaseChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitEventDefinition(ctx) {
    const identifier = ctx.children[1]
    const text = identifier.getText()

    if (naming.isNotCamelCase(text)) {
      this.error(ctx, 'Event name must be in CamelCase')
    }
  }
}

module.exports = EventNameCamelcaseChecker
