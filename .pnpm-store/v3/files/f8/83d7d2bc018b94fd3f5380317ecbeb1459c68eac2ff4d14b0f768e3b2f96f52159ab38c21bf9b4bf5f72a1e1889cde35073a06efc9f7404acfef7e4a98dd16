const _ = require('lodash')
const { typeOf } = require('./../../common/tree-traversing')
const { columnOf, lineOf, stopLine } = require('./../../common/tokens')
const { severityDescription } = require('../../doc/utils')

const ruleId = 'indent'
const DEFAULT_SEVERITY = 'error'
const DEFAULT_INDENTS = 4
const meta = {
  type: 'align',

  docs: {
    description: 'Indentation is incorrect.',
    category: 'Style Guide Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY
      },
      {
        description: 'Number of indents',
        default: DEFAULT_INDENTS
      }
    ],
    examples: {
      good: [
        {
          description: 'Contract with correct indentation',
          code: require('../../../test/fixtures/align/correctly_indented_contract')
        }
      ],
      bad: [
        {
          description: 'Contract with incorrect indentation',
          code: require('../../../test/fixtures/align/incorrectly_indented_contract')
        }
      ]
    }
  },

  isDefault: true,
  recommended: true,
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_INDENTS],

  schema: [
    {
      type: 'array',
      items: [{ type: 'integer' }],
      uniqueItems: true,
      minItems: 2
    }
  ]
}

class IndentChecker {
  constructor(reporter, config) {
    this.reporter = reporter
    this.ruleId = ruleId
    this.meta = meta
    this.linesWithError = []

    const indent = this.parseConfig(config).indent || 4
    const indentUnit = this.parseConfig(config).unit || 'spaces'

    this.blockValidator = new BlockValidator(indent, indentUnit, reporter, this.ruleId)
    this.nestedSingleLineValidator = new NestedSingleLineValidator(
      indent,
      indentUnit,
      reporter,
      this.ruleId
    )
    this.baseIndentMultiplicityValidator = new BaseIndentMultiplicityValidator(
      indent,
      reporter,
      this.ruleId
    )
  }

  enterBlock(ctx) {
    this.blockValidator.validateBlock(ctx)
  }

  enterContractDefinition(ctx) {
    this.blockValidator.validateBlock(ctx)
  }

  enterStructDefinition(ctx) {
    this.blockValidator.validateBlock(ctx)
  }

  enterEnumDefinition(ctx) {
    this.blockValidator.validateBlock(ctx)
  }

  enterImportDirective(ctx) {
    this.blockValidator.validateBlock(ctx)
  }

  enterFunctionCallArguments(ctx) {
    this.blockValidator.validateBlock(ctx)
  }

  enterIfStatement(ctx) {
    const THEN_STATEMENT_POSITION = 4
    const ELSE_STATEMENT_POSITION = 6
    const STATEMENTS_POSITION = [THEN_STATEMENT_POSITION, ELSE_STATEMENT_POSITION]

    this.nestedSingleLineValidator.validateMultiple(ctx, STATEMENTS_POSITION)
  }

  enterWhileStatement(ctx) {
    const STATEMENT_POSITION = 4

    this.nestedSingleLineValidator.validate(ctx, STATEMENT_POSITION)
  }

  enterDoWhileStatement(ctx) {
    this.nestedSingleLineValidator.validate(ctx, 1)
  }

  enterForStatement(ctx) {
    this.nestedSingleLineValidator.validate(ctx, ctx.children.length - 1)
  }

  enterSourceUnit(ctx) {
    ctx.children
      .filter(i => i.getText() !== '<EOF>')
      .forEach(curNode =>
        this.blockValidator.validateNode(0)(curNode, lineOf(curNode), columnOf(curNode))
      )
  }

  exitSourceUnit(ctx) {
    const linesWithErrors = this.getLinesWithError()

    this.baseIndentMultiplicityValidator.validate(linesWithErrors, ctx)
  }

  parseConfig(config) {
    const rules = (config && config.rules) || {}
    if (!(rules && rules.indent && rules.indent.length === 2)) {
      return {}
    }

    const indentConf = rules.indent[1]
    if (indentConf === 'tabs') {
      return { indent: 1, unit: 'tabs' }
    } else if (_.isNumber(indentConf)) {
      return { indent: indentConf, unit: 'spaces' }
    } else {
      return {}
    }
  }

  getLinesWithError() {
    return [].concat(
      this.nestedSingleLineValidator.linesWithError,
      this.blockValidator.linesWithError
    )
  }
}

class Block {
  constructor(ctx) {
    this.ctx = ctx
    this.startBracketIndex = _.memoize(this._startBracketIndex.bind(this))
    this.endBracketIndex = _.memoize(this._endBracketIndex.bind(this))
  }

  _startBracketIndex() {
    const children = this.ctx.children
    return children && children.map(i => i.getText()).indexOf('{')
  }

  hasStartBracket() {
    return this.startBracketIndex() !== null && this.startBracketIndex() >= 0
  }

  startBracket() {
    return this.ctx.children[this.startBracketIndex()]
  }

  startBracketLine() {
    return this.startBracket().symbol.line
  }

  _endBracketIndex() {
    return this.ctx.children.map(i => i.getText()).indexOf('}')
  }

  endBracket() {
    const children = this.ctx.children
    return children[children.length - 1]
  }

  endBracketLine() {
    return this.endBracket().symbol.line
  }

  endBracketColumn() {
    return this.endBracket().symbol.column
  }

  isBracketsOnSameLine() {
    return this.startBracketLine() === this.endBracketLine()
  }

  forEachNestedNode(callback) {
    for (let i = this.startBracketIndex() + 1; i < this.endBracketIndex(); i += 1) {
      const curItem = this.ctx.children[i]
      const isTerm = curItem.symbol

      if (!isTerm && callback) {
        callback(curItem, lineOf(curItem), columnOf(curItem))
      }
    }
  }
}

class KnowLineValidator {
  constructor(indent, indentUnit, reporter, ruleId) {
    this.indent = indent
    this.indentUnit = indentUnit
    this.reporter = reporter
    this.linesWithError = []
    this.ruleId = ruleId
  }

  makeReportCorrectLine(line, col, correctIndent) {
    this.linesWithError.push(line)

    const message = `Expected indentation of ${correctIndent} ${this.indentUnit} but found ${col}`
    this.reporter.errorAt(line, col, this.ruleId, message)
  }
}

class BlockValidator extends KnowLineValidator {
  validateBlock(ctx) {
    const block = new Block(ctx)

    if (!block.hasStartBracket() || block.isBracketsOnSameLine()) {
      return
    }

    this.validateIndentOfNestedElements(block)

    this.validateEndBracketIndent(block)
  }

  validateIndentOfNestedElements(block) {
    const requiredIndent = correctIndentOf(alreadyVerifiedRootNode(block.ctx)) + this.indent

    block.forEachNestedNode(this.validateNode(requiredIndent))
  }

  validateNode(requiredIndent) {
    return (curItem, curLine, curColumn) => {
      if (curColumn !== requiredIndent) {
        this.makeReportCorrectLine(curLine, curColumn, requiredIndent)
        curItem.indentError = { indent: curColumn, correctIndent: requiredIndent }
      }
    }
  }

  validateEndBracketIndent(block) {
    const endBracketCorrectIndent = correctIndentOf(alreadyVerifiedRootNode(block.ctx))

    if (endBracketCorrectIndent !== block.endBracketColumn()) {
      this.makeReportCorrectLine(
        block.endBracketLine(),
        block.endBracketColumn(),
        endBracketCorrectIndent
      )
    }
  }
}

class NestedSingleLineValidator extends KnowLineValidator {
  validateMultiple(ctx, indexes) {
    indexes.forEach(index => this.validate(ctx, index))
  }

  validate(ctx, index) {
    if (ctx.children.length <= index) {
      return
    }

    const statement = ctx.children[index]
    const statementColumn = columnOf(statement)
    const statementLine = lineOf(statement)
    const start = ctx.start
    const requiredIndent = correctIndentOf(ctx.parentCtx) + this.indent

    if (
      !['BlockContext', 'IfStatementContext'].includes(statement.children[0].constructor.name) &&
      statementColumn !== requiredIndent &&
      statementLine !== start.line
    ) {
      this.makeReportCorrectLine(statementLine, statementColumn, requiredIndent)
      statement.indentError = {
        indent: statementColumn,
        correctIndent: correctIndentOf(ctx.parentCtx) + this.indent
      }
    }
  }
}

class BaseIndentMultiplicityValidator {
  constructor(indent, reporter, ruleId) {
    this.reporter = reporter
    this.indent = indent
    this.firstIndent = new Map()
    this.ruleId = ruleId
  }

  validate(linesWithError, ctx) {
    const tokens = ctx.parser._input.tokens.filter(i => i.channel === 0 && i.type >= 0)

    tokens.forEach(this.applyTokenIndent.bind(this))

    for (const curLineStr in this.firstIndent) {
      const curLine = Number(curLineStr)
      if (linesWithError.includes(Number(curLine))) {
        continue
      }

      const curIndent = this.firstIndent[curLine]
      if (this.isNotValidForBaseIndent(curIndent)) {
        this.error(curLine, curIndent)
      }
    }
  }

  applyTokenIndent(token) {
    const line = token.line
    const column = token.column
    const curIndent = this.firstIndent[line]

    if (curIndent > column || _.isUndefined(curIndent)) {
      this.firstIndent[line] = column
    }
  }

  isNotValidForBaseIndent(indent) {
    return indent % this.indent !== 0
  }

  error(line, col) {
    this.reporter.errorAt(line, col, this.ruleId, 'Indentation is incorrect')
  }
}

function correctIndentOf(ctx) {
  let curIndent = columnOf(ctx)
  let curCtx = ctx

  do {
    if (curCtx.indentError) {
      curIndent = correctIndent(curIndent, curCtx.indentError)
      return curIndent
    }

    curCtx = curCtx.parentCtx
  } while (curCtx !== null && lineOf(ctx) === lineOf(curCtx))

  return curIndent
}

function correctIndent(curIndent, indentError) {
  return curIndent - indentError.indent + indentError.correctIndent
}

function firstNodeOfLine(ctx) {
  let rootCtx = ctx

  while (
    rootCtx.parentCtx &&
    rootCtx.start.line === rootCtx.parentCtx.start.line &&
    !['SourceUnitContext'].includes(rootCtx.parentCtx.constructor.name)
  ) {
    rootCtx = rootCtx.parentCtx
  }

  let resultNode = rootCtx

  if (rootCtx.parentCtx !== null) {
    const curParent = rootCtx.parentCtx
    const rootIdx = curParent.children.indexOf(rootCtx)

    for (let i = rootIdx - 1; i >= 0; i -= 1) {
      const curChild = curParent.children[i]

      if (stopLine(curChild) === lineOf(rootCtx)) {
        resultNode = curChild
      }
    }
  }

  if (lineOf(ctx) !== lineOf(resultNode)) {
    resultNode = firstNodeOfLine(resultNode)
  }

  return resultNode
}

function alreadyVerifiedRootNode(ctx) {
  const rootNode = firstNodeOfLine(ctx)

  // in case when open bracket is the first on the line
  if (rootNode === ctx && typeOf(ctx) === 'block' && firstChildText(ctx) === '{') {
    const parent = ctx.parentCtx

    if (typeOf(parent) === 'functionDefinition' || typeOf(parent) === 'constructorDefinition') {
      return firstNodeOfLine(parent)
    }
  }

  return rootNode
}

function firstChildText(ctx) {
  return ctx.children && ctx.children[0] && ctx.children[0].getText()
}

module.exports = IndentChecker
