const BaseChecker = require('./../base-checker')

const ruleId = 'avoid-call-value'
const meta = {
  type: 'security',

  docs: {
    description: `Avoid to use ".call.value()()".`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class AvoidCallValueChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitExpression(ctx) {
    this.validateCallValue(ctx)
  }

  validateCallValue(ctx) {
    if (ctx.getText().endsWith('.call.value')) {
      this.error(ctx, 'Avoid to use ".call.value()()"')
    }
  }
}

module.exports = AvoidCallValueChecker
