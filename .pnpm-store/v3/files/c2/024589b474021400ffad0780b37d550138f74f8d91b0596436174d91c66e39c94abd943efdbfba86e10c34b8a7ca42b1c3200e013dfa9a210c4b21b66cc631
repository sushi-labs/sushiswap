const BaseChecker = require('./../base-checker')
const {
  hasSpace,
  nextTokenFromToken,
  BaseTokenList,
  Token,
  AlignValidatable
} = require('./../../common/tokens')
const { noSpaces, prevTokenFromToken } = require('./../../common/tokens')

const ruleId = 'space-after-comma'
const meta = {
  type: 'align',

  docs: {
    description: 'Comma must be separated from next element by space.',
    category: 'Style Guide Rules',
    examples: {
      good: [
        {
          description: 'Expression with correct comma align',
          code: require('../../../test/fixtures/align/expressions_with_correct_comma_align')[0]
        }
      ],
      bad: [
        {
          description: 'Expression with incorrect comma align',
          code: require('../../../test/fixtures/align/expressions_with_incorrect_comma_align')[0]
        }
      ]
    }
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class SpaceAfterCommaChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitSourceUnit(ctx) {
    TokenList.from(ctx)
      .commaTokens()
      .filter(curToken => curToken.isIncorrectAligned())
      .forEach(this._error.bind(this))
  }

  _error(curToken) {
    const message = 'Comma must be separated from next element by space'
    this.errorAt(curToken.line, curToken.column, message)
  }
}

class TokenList extends BaseTokenList {
  commaTokens() {
    return this.tokens
      .filter(i => i.text === ',')
      .map(curToken => new CommaToken(this.tokens, curToken))
  }
}

class CommaToken extends AlignValidatable(Token) {
  isCorrectAligned() {
    return (
      (this._isNoSpacesBefore() || this._isCommaAfterComma()) &&
      (this._isSpaceAfter() || this._isCommaInEndOfExpression())
    )
  }

  _isNoSpacesBefore() {
    return noSpaces(this.curToken, this._prevToken())
  }

  _isSpaceAfter() {
    return hasSpace(this._nextToken(), this.curToken)
  }

  _isCommaInEndOfExpression() {
    const curToken = this.curToken
    const _nextToken = nextTokenFromToken(this.tokens, curToken)

    return [')', '}'].includes(_nextToken.text)
  }

  _isCommaAfterComma() {
    const curToken = this.curToken
    const _prevToken = prevTokenFromToken(this.tokens, curToken)

    return [','].includes(_prevToken.text)
  }

  _prevToken() {
    return prevTokenFromToken(this.tokens, this.curToken)
  }

  _nextToken() {
    return nextTokenFromToken(this.tokens, this.curToken)
  }
}

module.exports = SpaceAfterCommaChecker
