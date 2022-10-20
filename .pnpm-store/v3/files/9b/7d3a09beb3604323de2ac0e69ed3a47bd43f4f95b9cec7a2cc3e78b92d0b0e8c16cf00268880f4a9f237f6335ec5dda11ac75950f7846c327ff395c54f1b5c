const BaseChecker = require('./../base-checker')
const { typeOf } = require('./../../common/tree-traversing')

const ruleId = 'imports-on-top'
const meta = {
  type: 'order',

  docs: {
    description: `Import statements must be on top.`,
    category: 'Style Guide Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class ImportsOnTopChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitSourceUnit(ctx) {
    let hasContractDef = false
    for (let i = 0; ctx.children && i < ctx.children.length; i += 1) {
      const curItem = ctx.children[i]

      if (typeOf(curItem) === 'contractDefinition') {
        hasContractDef = true
      }

      if (hasContractDef && typeOf(curItem) === 'importDirective') {
        this._error(curItem)
      }
    }
  }

  _error(ctx) {
    this.error(ctx, 'Import statements must be on top')
  }
}

module.exports = ImportsOnTopChecker
