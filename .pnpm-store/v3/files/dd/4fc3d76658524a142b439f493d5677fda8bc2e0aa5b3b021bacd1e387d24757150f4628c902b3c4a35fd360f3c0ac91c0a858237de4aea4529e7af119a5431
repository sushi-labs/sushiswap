const BaseChecker = require('./../base-checker')

const ruleId = 'no-mix-tabs-and-spaces'
const meta = {
  type: 'align',

  docs: {
    description: 'Mixed tabs and spaces.',
    category: 'Style Guide Rules',
    examples: {
      bad: [
        {
          description: 'Expression with mixed tabs and spaces',
          code: require('../../../test/fixtures/align/expression_with_mixed_tabs_and_spaces')
        }
      ]
    }
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class NoMixTabsAndSpacesChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)

    const configDefined = config && config.rules && config.rules.indent && config.rules.indent[1]
    this.spacer = (configDefined && config.rules.indent[1] === 'tabs' && 'tabs') || 'spaces'
  }

  enterSourceUnit(ctx) {
    ctx.parser._input.tokenSource._input.strdata
      .split('\n')
      .map((i, index) => [i.replace(/[^\s]+.*/, ''), index])
      .filter(args => this.isMixTabsAndSpaces(args[0]))
      .forEach(args => this._error(args[1]))
  }

  isMixTabsAndSpaces(prefixLine) {
    const disallowedSpacer = this.spacer === 'tabs' ? ' ' : '\t'

    return prefixLine.includes(disallowedSpacer)
  }

  _error(line) {
    const message = `Mixed tabs and spaces. Allowed only ${this.spacer}`
    this.errorAt(line + 1, 0, message)
  }
}

module.exports = NoMixTabsAndSpacesChecker
