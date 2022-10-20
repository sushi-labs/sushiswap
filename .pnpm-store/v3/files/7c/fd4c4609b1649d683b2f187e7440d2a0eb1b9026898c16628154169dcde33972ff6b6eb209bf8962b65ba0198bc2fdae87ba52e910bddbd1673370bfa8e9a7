const BaseChecker = require('./../base-checker')
const TreeTraversing = require('./../../common/tree-traversing')
const naming = require('./../../common/identifier-naming')

const traversing = new TreeTraversing()

const ruleId = 'const-name-snakecase'
const meta = {
  type: 'naming',

  docs: {
    description: 'Constant name must be in capitalized SNAKE_CASE.',
    category: 'Style Guide Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class ConstNameSnakecaseChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitStateVariableDeclaration(ctx) {
    const hasConstModifier = ctx.children.some(i => i.getText() === 'constant')

    if (hasConstModifier) {
      this.validateConstantName(ctx)
    }
  }

  validateConstantName(ctx) {
    this._forEachIdentifier(ctx, (curId, text) => {
      if (naming.isNotUpperSnakeCase(text)) {
        this.error(curId, 'Constant name must be in capitalized SNAKE_CASE')
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

module.exports = ConstNameSnakecaseChecker
