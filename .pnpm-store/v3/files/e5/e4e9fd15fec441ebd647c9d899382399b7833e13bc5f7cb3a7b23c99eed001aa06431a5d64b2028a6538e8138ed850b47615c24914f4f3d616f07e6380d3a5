const BaseChecker = require('./../base-checker')

const ruleId = 'not-rely-on-time'
const meta = {
  type: 'security',

  docs: {
    description: `Avoid to make time-based decisions in your business logic.`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class NotRelyOnTimeChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitIdentifier(ctx) {
    this._textNotAllowed(ctx, 'now')
  }

  exitExpression(ctx) {
    this._textNotAllowed(ctx, 'block.timestamp')
  }

  _textNotAllowed(ctx, avoidedName) {
    if (ctx.getText() === avoidedName) {
      this._warn(ctx)
    }
  }

  _warn(ctx) {
    this.warn(ctx, 'Avoid to make time-based decisions in your business logic')
  }
}

module.exports = NotRelyOnTimeChecker
