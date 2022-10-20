const BaseChecker = require('./../base-checker')
const TreeTraversing = require('./../../common/tree-traversing')
const naming = require('./../../common/identifier-naming')

const traversing = new TreeTraversing()

const ruleId = 'var-name-mixedcase'
const meta = {
  type: 'naming',

  docs: {
    description: `Variable name must be in mixedCase.`,
    category: 'Style Guide Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class VarNameMixedcaseChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitIdentifierList(ctx) {
    this.validateVariablesName(ctx)
  }

  exitVariableDeclaration(ctx) {
    this.validateVariablesName(ctx)
  }

  exitStateVariableDeclaration(ctx) {
    const hasConstModifier = ctx.children.some(i => i.getText() === 'constant')

    if (!hasConstModifier) {
      this.validateVariablesName(ctx)
    }
  }

  validateVariablesName(ctx) {
    this._forEachIdentifier(ctx, (curId, text) => {
      if (naming.isNotMixedCase(text)) {
        this.error(curId, 'Variable name must be in mixedCase')
      }
    })
  }

  _forEachIdentifier(ctx, callback) {
    for (const curId of traversing.findIdentifier(ctx)) {
      const text = curId.getText()

      if (callback) {
        callback(curId, text)
      }
    }
  }
}

module.exports = VarNameMixedcaseChecker
