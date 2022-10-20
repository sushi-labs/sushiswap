const BaseChecker = require('./../base-checker')
const naming = require('./../../common/identifier-naming')

const ruleId = 'contract-name-camelcase'
const meta = {
  type: 'naming',

  docs: {
    description: 'Contract name must be in CamelCase.',
    category: 'Style Guide Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class ContractNameCamelcaseChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  enterContractDefinition(ctx) {
    this.validateContractName(ctx)
  }

  enterStructDefinition(ctx) {
    this.validateContractName(ctx)
  }

  enterEnumDefinition(ctx) {
    this.validateContractName(ctx)
  }

  validateContractName(ctx) {
    const identifier = ctx.children[1]
    const text = identifier.getText()

    if (naming.isNotCamelCase(text)) {
      this._error(identifier)
    }
  }

  _error(ctx) {
    this.error(ctx, 'Contract name must be in CamelCase')
  }
}

module.exports = ContractNameCamelcaseChecker
