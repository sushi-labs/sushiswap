const TreeTraversing = require('./../../common/tree-traversing')
const Reporter = require('./../../reporter')

const traversing = new TreeTraversing()
const SEVERITY = Reporter.SEVERITY

const ruleId = 'mark-callable-contracts'
const meta = {
  type: 'security',

  docs: {
    description: `Explicitly mark all external contracts as trusted or untrusted.`,
    category: 'Security Rules',
    examples: {
      good: [
        {
          description: 'External contract name with "Trusted" prefix',
          code: require('../../../test/fixtures/security/external-contract-trusted.js')
        }
      ],
      bad: [
        {
          description: 'External contract name without "Trusted" prefix',
          code: require('../../../test/fixtures/security/external-contract-untrusted.js')
        }
      ]
    }
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class MarkCallableContractsChecker {
  constructor(reporter) {
    this.reporter = reporter
    this.ruleId = ruleId
    this.meta = meta
    this.nonContractNames = []
  }

  enterStructDefinition(ctx) {
    this.gatherNonContractNames(ctx)
  }

  enterEventDefinition(ctx) {
    this.gatherNonContractNames(ctx)
  }

  enterEnumDefinition(ctx) {
    this.gatherNonContractNames(ctx)
  }

  enterEnumValue(ctx) {
    const enumValue = ctx.getText()
    this.nonContractNames.push(enumValue)
  }

  exitStateVariableDeclaration(ctx) {
    const hasConstModifier = ctx.children.some(i => i.getText() === 'constant')

    if (hasConstModifier) {
      this._forEachIdentifier(ctx, (curId, name) => {
        if (name) {
          this.nonContractNames.push(name)
        }
      })
    }
  }

  exitIdentifier(ctx) {
    const identifier = ctx.getText()
    const isFirstCharUpper = /[A-Z]/.test(identifier[0])
    const containsTrustInfo = identifier.toLowerCase().includes('trust')
    const isStatement = traversing.findParentType(ctx, 'StatementContext')

    if (
      isFirstCharUpper &&
      !containsTrustInfo &&
      isStatement &&
      !this.nonContractNames.includes(identifier)
    ) {
      this.reporter.addMessage(
        ctx.getSourceInterval(),
        SEVERITY.WARN,
        'Explicitly mark all external contracts as trusted or untrusted',
        this.ruleId
      )
    }
  }

  gatherNonContractNames(ctx) {
    const identifier = ctx.children[1]
    const name = identifier.getText()

    if (name) {
      this.nonContractNames.push(name)
    }
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

module.exports = MarkCallableContractsChecker
