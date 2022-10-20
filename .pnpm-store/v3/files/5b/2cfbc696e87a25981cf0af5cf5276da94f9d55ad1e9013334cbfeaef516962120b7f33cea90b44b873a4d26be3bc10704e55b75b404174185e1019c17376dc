const BaseDeprecation = require('./base-deprecation')
const TreeTraversing = require('./../../common/tree-traversing')

const traversing = new TreeTraversing()

const ruleId = 'constructor-syntax'
const meta = {
  type: 'best-practises',

  docs: {
    description: 'Constructors should use the new constructor keyword.',
    category: 'Best Practise Rules'
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: []
}

class ConstructorSyntax extends BaseDeprecation {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  deprecationVersion() {
    return '0.4.22'
  }

  exitFunctionDefinition(ctx) {
    if (this.active) {
      const contract = traversing.findParentType(ctx, 'ContractDefinitionContext')
      const contractName = contract.children[1].getText()
      const functionName = ctx.children[1].getText()
      if (functionName === contractName) {
        this.warn(ctx, 'Constructors should use the new constructor keyword.')
      }
    }
  }

  exitConstructorDefinition(ctx) {
    if (!this.active) {
      const message = 'Constructor keyword not available before 0.4.22 (' + this.version + ')'
      this.error(ctx, message)
    }
  }
}

module.exports = ConstructorSyntax
