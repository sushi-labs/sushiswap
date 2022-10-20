const _ = require('lodash')
const BaseChecker = require('./../base-checker')
const { StatementsIndentValidator, Term } = require('./../../common/statements-indent-validator')
const { onSameLine, stopOf, startOf } = require('./../../common/tokens')
const { typeOf } = require('./../../common/tree-traversing')

const ruleId = 'statement-indent'
const meta = {
  type: 'align',

  docs: {
    description: 'Statement indentation is incorrect.',
    category: 'Style Guide Rules',
    examples: {
      good: [
        {
          description: 'Statements with correct indentation',
          code: require('../../../test/fixtures/align/statements_with_correct_indents').join('\n')
        }
      ],
      bad: [
        {
          description: 'Statements with incorrect indentation',
          code: require('../../../test/fixtures/align/statements_with_incorrect_indents').join('\n')
        }
      ]
    }
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class StatementIndentChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  enterIfStatement(ctx) {
    new StatementsIndentValidator(ctx)
      .cases(ifWithoutElse(), ifElse())
      .errorsTo(this._error.bind(this))

    this.validateBracketsForElseStatement(ctx)
  }

  enterWhileStatement(ctx) {
    Term.term('while')
      .space()
      .term('(')
      .noSpaces()
      .expression()
      .noSpaces()
      .term(')')
      .statement()
      .errorsTo(ctx, this._error.bind(this))
  }

  enterDoWhileStatement(ctx) {
    Term.term('do')
      .statement()
      .term('while')
      .space()
      .term('(')
      .noSpaces()
      .expression()
      .noSpaces()
      .term(')')
      .noSpaces()
      .term(';')
      .errorsTo(ctx, this._error.bind(this))

    this.validateBracketsForDoWhileStatement(ctx)
  }

  enterForStatement(ctx) {
    new StatementsIndentValidator(ctx).cases(...forLoopAllCases()).errorsTo(this._error.bind(this))
  }

  validateBracketsForElseStatement(ctx) {
    const IF_WITH_ELSE_LENGTH = 7
    const STATEMENT_IDX = 4
    const ELSE_IDX = 5

    if (ctx.children.length === IF_WITH_ELSE_LENGTH) {
      this._validateThatOnSameLine(ctx, STATEMENT_IDX, ELSE_IDX)
    }
  }

  validateBracketsForDoWhileStatement(ctx) {
    const STATEMENT_IDX = 1
    const WHILE_IDX = 2

    this._validateThatOnSameLine(ctx, STATEMENT_IDX, WHILE_IDX)
  }

  _validateThatOnSameLine(ctx, blockIndex, nodeIndex) {
    const childs = ctx.children
    const block = childs[blockIndex]
    const node = childs[nodeIndex]

    if (isBlock(block) && !onSameLine(stopOf(block), startOf(node))) {
      const nodeText = node.getText()
      this._error(node, `${_.capitalize(nodeText)} must be on the same line with close bracket.`)
    }
  }

  _error(ctx, message) {
    this.error(ctx, `Statement indentation is incorrect. ${message}`)
  }
}

function isBlock(ctx) {
  let childs = ctx.children

  while (childs && childs.length === 1) {
    if (typeOf(childs[0]) === 'block') {
      return true
    }

    childs = childs[0].children
  }

  return false
}

function forLoopWith(config) {
  const { statement, expression1, expression2 } = config
  const seq = Term.term('for')
    .space()
    .term('(')

  if (!(statement && seq.noSpaces().rule('simpleStatement'))) {
    seq.term(';')
  }

  if (expression1) {
    seq.space().expression()
  }
  seq.term(';')

  if (expression2) {
    seq.space().expression()
  }

  return seq
    .noSpaces()
    .term(')')
    .statement()
}

function forLoopAllCases() {
  const cases = []

  for (let i = Math.pow(2, 3) - 1; i >= 0; i -= 1) {
    cases.push(
      forLoopWith({
        statement: i & 0b001,
        expression1: i & 0b010,
        expression2: i & 0b100
      })
    )
  }

  return cases
}

function ifWithoutElse() {
  return Term.term('if')
    .space()
    .term('(')
    .noSpaces()
    .expression()
    .noSpaces()
    .term(')')
    .statement()
}

function ifElse() {
  return ifWithoutElse()
    .term('else')
    .statement()
}

module.exports = StatementIndentChecker
