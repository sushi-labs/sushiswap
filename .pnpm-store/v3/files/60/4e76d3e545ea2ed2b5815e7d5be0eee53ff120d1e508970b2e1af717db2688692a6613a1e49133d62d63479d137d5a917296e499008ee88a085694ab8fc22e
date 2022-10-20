const BaseChecker = require('./../base-checker')

const ruleId = 'avoid-sha3'
const meta = {
  type: 'security',

  docs: {
    description: `Use "keccak256" instead of deprecated "sha3".`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class AvoidSha3Checker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitIdentifier(ctx) {
    const identifier = ctx.Identifier().toString()

    if (identifier === 'sha3') {
      this.error(ctx, 'Use "keccak256" instead of deprecated "sha3"')
    }
  }
}

module.exports = AvoidSha3Checker
