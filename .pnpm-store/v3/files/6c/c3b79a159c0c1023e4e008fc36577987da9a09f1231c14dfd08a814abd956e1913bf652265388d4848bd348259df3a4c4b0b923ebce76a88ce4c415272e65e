const BaseChecker = require('./../base-checker')
const TreeTraversing = require('./../../common/tree-traversing')

const traversing = new TreeTraversing()

const ruleId = 'check-send-result'
const meta = {
  type: 'security',

  docs: {
    description: `Check result of "send" call.`,
    category: 'Security Rules',
    examples: {
      good: [
        {
          description: 'result of "send" call checked with if statement',
          code: require('../../../test/fixtures/security/send-result-checked')
        }
      ],
      bad: [
        {
          description: 'result of "send" call ignored',
          code: require('../../../test/fixtures/security/send-result-ignored')
        }
      ]
    }
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class CheckSendResultChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitExpression(ctx) {
    this.validateSend(ctx)
  }

  validateSend(ctx) {
    if (ctx.getText().includes('.send(')) {
      const hasVarDeclaration = traversing.statementNotContains(ctx, 'VariableDeclarationContext')
      const hasIfStatement = traversing.statementNotContains(ctx, 'IfStatementContext')

      if (!hasIfStatement && !hasVarDeclaration) {
        this.error(ctx, 'Check result of "send" call')
      }
    }
  }
}

module.exports = CheckSendResultChecker
