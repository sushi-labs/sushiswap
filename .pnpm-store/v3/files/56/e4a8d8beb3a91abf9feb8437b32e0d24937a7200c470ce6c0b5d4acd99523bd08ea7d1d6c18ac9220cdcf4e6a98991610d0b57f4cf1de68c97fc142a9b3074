const _ = require('lodash')
const BaseChecker = require('./../base-checker')
const TreeTraversion = require('./../../common/tree-traversing')

const traversing = new TreeTraversion()
const { typeOf } = TreeTraversion

const ruleId = 'no-unused-vars'
const meta = {
  type: 'best-practises',

  docs: {
    description: 'Variable "name" is unused.',
    category: 'Best Practise Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class NoUnusedVarsChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  enterFunctionDefinition(ctx) {
    const lastNode = _.last(ctx.children)
    const funcWithoutBlock = isFuncWithoutBlock(lastNode)
    const emptyBlock = isEmptyBlock(lastNode)

    if (!ignoreWhen(funcWithoutBlock, emptyBlock)) {
      VarUsageScope.activate(ctx)
    }
  }

  enterParameter(ctx) {
    if (!ignoreWhen(returnParams(ctx))) {
      this._addVariable(ctx)
    }
  }

  enterVariableDeclaration(ctx) {
    this._addVariable(ctx)
  }

  enterIdentifierList(ctx) {
    for (const curId of traversing.findIdentifier(ctx)) {
      this._addVariable(curId)
    }
  }

  enterIdentifier(ctx) {
    this._trackVarUsage(ctx)
  }

  enterAssemblyCall(ctx) {
    const firstChild = _.first(ctx.children)

    if (firstChild) {
      this._trackVarUsage(firstChild)
    }
  }

  exitFunctionDefinition(ctx) {
    if (VarUsageScope.isActivated(ctx)) {
      this._reportErrorsFor(ctx)
    }
  }

  _addVariable(ctx) {
    const isCtxIdentifier = typeOf(ctx) === 'identifier'
    const idNode = isCtxIdentifier ? ctx : findIdentifierInChildren(ctx)
    const funcScope = VarUsageScope.of(ctx)

    if (idNode && funcScope) {
      funcScope.addVar(idNode, idNode.getText())
    }
  }

  _trackVarUsage(ctx) {
    const isFunctionName = typeOf(ctx.parentCtx) === 'functionDefinition'
    const funcScope = VarUsageScope.of(ctx)

    if (funcScope && !this._isVarDeclaration(ctx) && !isFunctionName) {
      funcScope.trackVarUsage(ctx.getText())
    }
  }

  _reportErrorsFor(ctx) {
    VarUsageScope.of(ctx)
      .unusedVariables()
      .forEach(this._error.bind(this))
  }

  _error({ name, ctx }) {
    this.warn(ctx, `Variable "${name}" is unused`)
  }

  _isVarDeclaration(ctx) {
    const variableDeclaration = findParentType(ctx, 'variableDeclaration')
    const identifierList = findParentType(ctx, 'identifierList')
    const parameterList = findParentType(ctx, 'parameterList')

    return variableDeclaration || identifierList || parameterList
  }
}

class VarUsageScope {
  static of(ctx) {
    let functionNode

    if (typeOf(ctx) === 'functionDefinition') {
      functionNode = ctx
    } else {
      functionNode = findParentType(ctx, 'functionDefinition')
    }

    return functionNode && functionNode.funcScope
  }

  static activate(ctx) {
    ctx.funcScope = new VarUsageScope()
  }

  static isActivated(ctx) {
    return !!ctx.funcScope
  }

  constructor() {
    this.vars = {}
  }

  addVar(ctx, name) {
    this.vars[name] = { ctx, usage: 0 }
  }

  trackVarUsage(name) {
    const curVar = this.vars[name]

    if (curVar) {
      curVar.usage += 1
    }
  }

  unusedVariables() {
    return _(this.vars)
      .pickBy(val => val.usage === 0)
      .map((info, varName) => ({ name: varName, ctx: info.ctx }))
      .value()
  }
}

function isEmptyBlock(node) {
  const OPEN_CLOSE_BRACKETS_LENGTH = 2
  return _.size(node.children) === OPEN_CLOSE_BRACKETS_LENGTH
}

function isFuncWithoutBlock(node) {
  return node.getText() === ';'
}

function ignoreWhen(...args) {
  return _.some(args)
}

function returnParams(ctx) {
  return findParentType(ctx, 'returnParameters')
}

function typeName(type) {
  return type[0].toUpperCase() + type.substring(1) + 'Context'
}

function findParentType(ctx, type) {
  return traversing.findParentType(ctx, typeName(type))
}

function findIdentifierInChildren(ctx) {
  return traversing.findTypeInChildren(ctx, typeName('identifier'))
}

module.exports = NoUnusedVarsChecker
