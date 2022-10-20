const BaseChecker = require('./../base-checker')
const {
  StatementsIndentValidator,
  Term,
  Rule
} = require('./../../common/statements-indent-validator')

const ruleId = 'expression-indent'
const meta = {
  type: 'align',

  docs: {
    description: 'Expression indentation is incorrect.',
    category: 'Style Guide Rules',
    examples: {
      good: [
        {
          description: 'Expressions with correct indentation',
          code: require('../../../test/fixtures/align/expressions_with_correct_indents').join('\n')
        }
      ],
      bad: [
        {
          description: 'Expressions with incorrect indentation',
          code: require('../../../test/fixtures/align/expressions_with_incorrect_indents').join(
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

class ExpressionIndentChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  enterExpression(ctx) {
    const expression = Rule.expression
    const term = Term.term

    new StatementsIndentValidator(ctx)
      .cases(
        term('new')
          .space()
          .rule('typeName'),
        expression()
          .noSpacesAround('[')
          .expression()
          .noSpaces()
          .term(']'),
        expression()
          .noSpacesAround('(')
          .rule('functionCallArguments')
          .noSpaces()
          .term(')'),
        expression()
          .noSpacesAround('.')
          .identifier(),
        term('(')
          .noSpaces()
          .expression()
          .noSpaces()
          .term(')'),
        expression()
          .spaceAround('=', '|=', '^=', '&=', '<<=')
          .expression(),
        expression()
          .spaceAround('>>=', '+=', '-=', '*=', '/=', '%=')
          .expression(),
        expression()
          .spaceAround('==', '!=', '<', '>', '<=', '>=')
          .expression(),
        expression()
          .spaceAroundOrNot('^', '**', '*', '/', '%', '+', '-')
          .expression(),
        expression()
          .spaceAroundOrNot('<<', '>>', '&', '|', '&&', '||')
          .expression(),
        expression()
          .spaceAround('?')
          .expression()
          .spaceAround(':')
          .expression(),
        term('!', '~', '+', '-', '++', '--')
          .noSpaces()
          .expression(),
        term('after', 'delete')
          .space()
          .expression(),
        expression()
          .noSpaces()
          .term('++', '--')
      )
      .errorsTo(this._error.bind(this))
  }

  _error(ctx, message) {
    this.error(ctx, `Expression indentation is incorrect. ${message}`)
  }
}

module.exports = ExpressionIndentChecker
