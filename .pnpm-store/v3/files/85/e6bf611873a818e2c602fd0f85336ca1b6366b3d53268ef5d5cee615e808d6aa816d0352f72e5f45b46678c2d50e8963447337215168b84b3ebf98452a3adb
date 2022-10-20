const BaseChecker = require('./../base-checker')
const { hasNoSpacesBefore } = require('./../../common/tokens')

const ruleId = 'array-declaration-spaces'
const meta = {
  type: 'align',

  docs: {
    description: 'Array declaration must not contains spaces.',
    category: 'Style Guide Rules',
    examples: {
      good: [
        {
          description: 'Array declaration without spaces',
          code: require('../../../test/fixtures/align/array_declaration')
        }
      ],
      bad: [
        {
          description: 'Array declaration with spaces',
          code: require('../../../test/fixtures/align/array_declaration_with_spaces')
        }
      ]
    }
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class ArrayDeclarationSpacesChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  enterTypeName(ctx) {
    this.validateSpaceBeforeBracket(ctx, '[')
    this.validateSpaceBeforeBracket(ctx, ']')
  }

  validateSpaceBeforeBracket(ctx, bracketSymbol) {
    const bracket = this._bracket(ctx, bracketSymbol)

    if (bracket && !hasNoSpacesBefore(bracket)) {
      this.makeReport(bracket)
    }
  }

  _bracket(ctx, bracketSymbol) {
    const children = ctx.children
    const bracket = children && children.filter(i => i.getText() === bracketSymbol)

    return bracket.length === 1 ? bracket[0] : null
  }

  makeReport(ctx) {
    this.error(ctx, 'Array declaration must not contains spaces')
  }
}

module.exports = ArrayDeclarationSpacesChecker
