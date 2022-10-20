const BaseChecker = require('./../base-checker')
const TreeTraversing = require('./../../common/tree-traversing')

const traversing = new TreeTraversing()

const ruleId = 'multiple-sends'
const meta = {
  type: 'security',

  docs: {
    description: `Avoid multiple calls of "send" method in single transaction.`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class MultipleSendsChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
    this.funcDefSet = new Set()
  }

  exitExpression(ctx) {
    const isOk = this.validateMultipleSendInFunc(ctx)
    if (isOk) {
      this.validateSendCallInLoop(ctx)
    }
  }

  validateMultipleSendInFunc(ctx) {
    if (ctx.getText().includes('.send(')) {
      const curFuncDef = traversing.findParentType(ctx, 'FunctionDefinitionContext')

      if (curFuncDef && this.funcDefSet.has(curFuncDef)) {
        this._error(ctx)
        return false
      } else {
        this.funcDefSet.add(curFuncDef)
      }
    }

    return true
  }

  validateSendCallInLoop(ctx) {
    if (ctx.getText().includes('.send(')) {
      const hasForLoop = traversing.findParentType(ctx, 'ForStatementContext') !== null
      const hasWhileLoop = traversing.findParentType(ctx, 'WhileStatementContext') !== null
      const hasDoWhileLoop = traversing.findParentType(ctx, 'DoWhileStatementContext') !== null

      if (hasForLoop || hasWhileLoop || hasDoWhileLoop) {
        this._error(ctx)
      }
    }
  }

  _error(ctx) {
    this.error(ctx, 'Avoid multiple calls of "send" method in single transaction')
  }
}

module.exports = MultipleSendsChecker
