const BaseChecker = require('./../base-checker')

const ruleId = 'avoid-tx-origin'
const meta = {
  type: 'security',

  docs: {
    description: `Avoid to use tx.origin.`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class AvoidTxOriginChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitExpression(ctx) {
    // expression1 '.' expression2
    const { expression1, dot, expression2 } = this._nodes(ctx)

    if (dot && expression1.getText() === 'tx' && expression2.getText() === 'origin') {
      this.error(ctx, 'Avoid to use tx.origin')
    }
  }

  _nodes(ctx) {
    if (!this._isDotExpression(ctx)) {
      return {}
    }

    return {
      expression1: ctx.children[0],
      dot: ctx.children[1],
      expression2: ctx.children[2]
    }
  }

  _isDotExpression(ctx) {
    return ctx.children && ctx.children[1] && ctx.children[1].getText() === '.'
  }
}

module.exports = AvoidTxOriginChecker
