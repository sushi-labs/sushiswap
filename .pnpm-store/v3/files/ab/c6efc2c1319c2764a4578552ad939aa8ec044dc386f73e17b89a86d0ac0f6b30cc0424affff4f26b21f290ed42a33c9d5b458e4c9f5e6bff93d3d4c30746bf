const BaseChecker = require('./../base-checker')
const {
  noSpaces,
  prevTokenFromToken,
  BaseTokenList,
  Token,
  AlignValidatable
} = require('./../../common/tokens')

const ruleId = 'no-spaces-before-semicolon'
const meta = {
  type: 'align',

  docs: {
    description: 'Semicolon must not have spaces before.',
    category: 'Style Guide Rules',
    examples: {
      good: [
        {
          description: 'Expression with correct semicolon align',
          code: require('../../../test/fixtures/align/expressions_with_correct_semicolon_align').join(
            '\n'
          )
        }
      ],
      bad: [
        {
          description: 'Expression with incorrect semicolon align',
          code: require('../../../test/fixtures/align/expressions_with_incorrect_semicolon_align').join(
            '\n'
          )
        }
      ]
    }
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class NoSpacesBeforeSemicolonChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitSourceUnit(ctx) {
    TokenList.from(ctx)
      .semicolonTokens()
      .filter(curToken => curToken.isIncorrectAligned())
      .forEach(this._error.bind(this))
  }

  _error(curToken) {
    const message = 'Semicolon must not have spaces before'
    this.errorAt(curToken.line, curToken.column, message)
  }
}

class TokenList extends BaseTokenList {
  semicolonTokens() {
    return this.tokens
      .filter(i => i.text === ';')
      .map(curToken => new SemicolonToken(this.tokens, curToken))
  }
}

class SemicolonToken extends AlignValidatable(Token) {
  isCorrectAligned() {
    const curToken = this.curToken
    const prevToken = prevTokenFromToken(this.tokens, curToken)

    return noSpaces(curToken, prevToken)
  }
}

module.exports = NoSpacesBeforeSemicolonChecker
