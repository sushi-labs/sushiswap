const BaseChecker = require('./../base-checker')

const ruleId = 'no-simple-event-func-name'
const meta = {
  type: 'security',

  docs: {
    description: `Event and function names must be different.`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  deprecated: true,

  schema: []
}

class NoSimpleEventFuncNameChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)

    this.funcNameMap = {}
    this.eventNameMap = {}
  }

  exitFunctionDefinition(ctx) {
    const secondChild = ctx.children[1]

    if (secondChild.constructor.name === 'IdentifierContext') {
      const id = secondChild.getText().toLowerCase()

      if (this.eventNameMap[id]) {
        this._error(ctx)
      }

      this.funcNameMap[id] = true
    }
  }

  exitEventDefinition(ctx) {
    const id = ctx.children[1].getText().toLowerCase()

    if (this.funcNameMap[id]) {
      this._error(ctx)
    }

    this.eventNameMap[id] = true
  }

  _error(ctx) {
    this.warn(ctx, 'Event and function names must be different')
  }
}

module.exports = NoSimpleEventFuncNameChecker
