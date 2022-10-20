const BaseChecker = require('./../base-checker')
const naming = require('./../../common/identifier-naming')
const TreeTraversing = require('./../../common/tree-traversing')

const { typeOf } = TreeTraversing
const traversing = new TreeTraversing()

const ruleId = 'func-name-mixedcase'
const meta = {
  type: 'naming',

  docs: {
    description: 'Function name must be in camelCase.',
    category: 'Style Guide Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class FuncNameMixedcaseChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitFunctionDefinition(ctx) {
    const identifier = ctx.children[1]

    if (typeOf(identifier) === 'identifier') {
      const text = identifier.getText()

      if (naming.isNotMixedCase(text) && !this.isConstructor(ctx, text)) {
        this.error(ctx, 'Function name must be in mixedCase')
      }
    }
  }

  isConstructor(ctx, name) {
    const parentDefinition = traversing.findParentType(ctx, 'ContractDefinitionContext')
    const contractName = parentDefinition.children[1].getText()

    return contractName === name
  }
}

module.exports = FuncNameMixedcaseChecker
