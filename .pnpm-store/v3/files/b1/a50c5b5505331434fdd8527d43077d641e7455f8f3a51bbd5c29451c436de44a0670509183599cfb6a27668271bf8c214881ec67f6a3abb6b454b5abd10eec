const BaseChecker = require('./../base-checker')

const ruleId = 'not-rely-on-block-hash'
const meta = {
  type: 'security',

  docs: {
    description: `Do not rely on "block.blockhash". Miners can influence its value.`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class NotRelyOnBlockHashChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitExpression(ctx) {
    if (ctx.getText() === 'block.blockhash') {
      this._warn(ctx)
    }
  }

  _warn(ctx) {
    this.warn(ctx, 'Do not rely on "block.blockhash". Miners can influence its value.')
  }
}

module.exports = NotRelyOnBlockHashChecker
