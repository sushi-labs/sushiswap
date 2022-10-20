const _ = require('lodash')
const BaseChecker = require('./../base-checker')
const { lineOf, stopLine } = require('./../../common/tokens')
const { severityDescription } = require('../../doc/utils')

const DEFAULT_SEVERITY = 'warn'
const DEFAULT_MAX_LINES_COUNT = 50
const ruleId = 'function-max-lines'
const meta = {
  type: 'best-practises',

  docs: {
    description: 'Function body contains "count" lines but allowed no more than maxlines.',
    category: 'Best Practise Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY
      },
      {
        description: 'Maximum allowed lines count per function',
        default: DEFAULT_MAX_LINES_COUNT
      }
    ]
  },

  isDefault: false,
  recommended: false,
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_MAX_LINES_COUNT],

  schema: [
    {
      type: 'array',
      items: [{ type: 'integer' }],
      uniqueItems: true,
      minItems: 2
    }
  ]
}

class FunctionMaxLinesChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)

    this.maxLines =
      (config && config.getNumber(ruleId, DEFAULT_MAX_LINES_COUNT)) || DEFAULT_MAX_LINES_COUNT
  }

  enterFunctionDefinition(ctx) {
    const block = Block.of(ctx)

    if (block.linesCount() > this.maxLines) {
      this._error(block)
    }
  }

  _error(block) {
    const linesCount = block.linesCount()
    const message = `Function body contains ${linesCount} lines but allowed no more than ${
      this.maxLines
    } lines`
    this.error(block.ctx, message)
  }
}

class Block {
  static of(functionDefinitionCtx) {
    const lastNode = _.last(functionDefinitionCtx.children)
    return new Block(lastNode)
  }

  constructor(ctx) {
    this.ctx = ctx
  }

  linesCount() {
    const ctx = this.ctx
    const startStopGap = stopLine(ctx) - lineOf(ctx)

    if (this._isSingleLineBlock(startStopGap)) {
      return 1
    } else {
      return this._withoutCloseBracket(startStopGap)
    }
  }

  _isSingleLineBlock(startStopGap) {
    return startStopGap === 0
  }

  _withoutCloseBracket(startStopGap) {
    return startStopGap - 1
  }
}

module.exports = FunctionMaxLinesChecker
