const BaseChecker = require('./../base-checker')
const naming = require('./../../common/identifier-naming')
const { typeOf } = require('./../../common/tree-traversing')

const ruleId = 'func-param-name-mixedcase'
const meta = {
  type: 'naming',

  docs: {
    description: 'Function name must be in camelCase.',
    category: 'Style Guide Rules'
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: []
}

class FunctionParamNameMixedcaseChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitEventParameter(ctx) {
    this.exitParameter(ctx)
  }

  exitParameter(ctx) {
    const identifier = this.findIdentifier(ctx)

    if (identifier && naming.isNotMixedCase(identifier.getText())) {
      this._error(identifier)
    }
  }

  findIdentifier(ctx) {
    const children = ctx.children

    const ids = children.filter(i => typeOf(i) === 'identifier')

    return ids.length > 0 && ids[0]
  }

  _error(identifier) {
    this.error(identifier, 'Function param name must be in mixedCase')
  }
}

module.exports = FunctionParamNameMixedcaseChecker
