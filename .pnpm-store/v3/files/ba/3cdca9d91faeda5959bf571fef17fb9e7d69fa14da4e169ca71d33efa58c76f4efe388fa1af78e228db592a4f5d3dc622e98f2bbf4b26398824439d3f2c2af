const BaseChecker = require('./../base-checker')
const { typeOf } = require('./../../common/tree-traversing')
const { isFallbackFunction, isFunctionDefinition } = require('./../../common/ast-types')

const ONLY_BRACKETS_LENGTH = 2
const EMPTY_STRUCT_LENGTH = 4
const EMPTY_ENUM_LENGTH = 4

const ruleId = 'no-empty-blocks'
const meta = {
  type: 'best-practises',

  docs: {
    description: 'Code contains empty block.',
    category: 'Best Practise Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class NoEmptyBlocksChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  exitBlock(ctx) {
    const isFallbackFunctionBlock =
      isFunctionDefinition(ctx.parentCtx) && isFallbackFunction(ctx.parentCtx)
    if (isFallbackFunctionBlock) {
      // ignore empty blocks in fallback functions
      return
    }
    this._validateChildrenCount(ctx, ONLY_BRACKETS_LENGTH)
  }

  exitStructDefinition(ctx) {
    this._validateChildrenCount(ctx, EMPTY_STRUCT_LENGTH)
  }

  exitEnumDefinition(ctx) {
    this._validateChildrenCount(ctx, EMPTY_ENUM_LENGTH)
  }

  exitAssemblyBlock(ctx) {
    this._validateChildrenCount(ctx, ONLY_BRACKETS_LENGTH)
  }

  exitContractDefinition(ctx) {
    this._validateContractPartsCount(ctx)
  }

  _validateChildrenCount(ctx, count) {
    if (ctx.children && ctx.children.length === count) {
      this._error(ctx)
    }
  }

  _validateContractPartsCount(ctx) {
    const contractPartCount = ctx.children.filter(i => typeOf(i) === 'contractPart').length

    if (contractPartCount === 0) {
      this._error(ctx)
    }
  }

  _error(ctx) {
    this.warn(ctx, 'Code contains empty block')
  }
}

module.exports = NoEmptyBlocksChecker
