const BaseChecker = require('./../base-checker')
const TreeTraversing = require('./../../common/tree-traversing')

const traversing = new TreeTraversing()

const ruleId = 'func-order'
const meta = {
  type: 'order',

  docs: {
    description: `Function order is incorrect.`,
    category: 'Style Guide Rules',
    examples: {
      good: [
        {
          description: 'Constructor is placed before other functions',
          code: require('../../../test/fixtures/order/func-order-constructor-first')
        }
      ],
      bad: [
        {
          description: 'Constructor is placed after other functions',
          code: require('../../../test/fixtures/order/func-order-constructor-not-first')
        }
      ]
    }
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: []
}

class FuncOrderChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  enterContractDefinition(ctx) {
    this._assignOrderAnalysisTo(ctx)
  }

  enterStructDefinition(ctx) {
    this._assignOrderAnalysisTo(ctx)
  }

  _assignOrderAnalysisTo(ctx) {
    const nameCtx = ctx.children[1]
    ctx.funcOrderAnalysis = new FunctionOrderAnalysis(nameCtx.getText(), this.reporter, this.ruleId)
  }

  exitConstructorDefinition(ctx) {
    const contract = traversing.findParentType(ctx, 'ContractDefinitionContext')
    contract.funcOrderAnalysis.process(ctx)
  }

  exitFunctionDefinition(ctx) {
    const contract = traversing.findParentType(ctx, 'ContractDefinitionContext')
    contract.funcOrderAnalysis.process(ctx)
  }
}

class State {
  constructor(config) {
    this.name = config.name
    this.after = config.after
    this.rules = config.rules
  }

  nextState(name) {
    const items = this.rules.filter(i => i.on === name).map(i => i.goTo)

    return items.length > 0 ? items[0] : null
  }
}

const STATES = {
  START: new State({
    name: 'START',
    after: '',
    rules: [
      { on: 'constructor', goTo: 'AFTER_CONSTR' },
      { on: 'fallback', goTo: 'AFTER_FALLBACK' },
      { on: 'external', goTo: 'AFTER_EXTERNAL' },
      { on: 'external_const', goTo: 'AFTER_EXTERNAL_CONSTANT' },
      { on: 'public', goTo: 'AFTER_PUBLIC' },
      { on: 'public_const', goTo: 'AFTER_PUBLIC_CONSTANT' },
      { on: 'internal', goTo: 'AFTER_INTERNAL' },
      { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]
  }),

  AFTER_CONSTR: new State({
    name: 'AFTER_CONSTR',
    after: 'constructor',
    rules: [
      { on: 'fallback', goTo: 'AFTER_FALLBACK' },
      { on: 'external', goTo: 'AFTER_EXTERNAL' },
      { on: 'external_const', goTo: 'AFTER_EXTERNAL_CONSTANT' },
      { on: 'public', goTo: 'AFTER_PUBLIC' },
      { on: 'public_const', goTo: 'AFTER_PUBLIC_CONSTANT' },
      { on: 'internal', goTo: 'AFTER_INTERNAL' },
      { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]
  }),

  AFTER_FALLBACK: new State({
    name: 'AFTER_CONSTR',
    after: 'fallback',
    rules: [
      { on: 'external', goTo: 'AFTER_EXTERNAL' },
      { on: 'external_const', goTo: 'AFTER_EXTERNAL_CONSTANT' },
      { on: 'public', goTo: 'AFTER_PUBLIC' },
      { on: 'public_const', goTo: 'AFTER_PUBLIC_CONSTANT' },
      { on: 'internal', goTo: 'AFTER_INTERNAL' },
      { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]
  }),

  AFTER_EXTERNAL: new State({
    name: 'AFTER_EXTERNAL',
    after: 'external',
    rules: [
      { on: 'external', goTo: 'AFTER_EXTERNAL' },
      { on: 'external_const', goTo: 'AFTER_EXTERNAL_CONSTANT' },
      { on: 'public', goTo: 'AFTER_PUBLIC' },
      { on: 'public_const', goTo: 'AFTER_PUBLIC_CONSTANT' },
      { on: 'internal', goTo: 'AFTER_INTERNAL' },
      { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]
  }),

  AFTER_EXTERNAL_CONSTANT: new State({
    name: 'AFTER_EXTERNAL_CONSTANT',
    after: 'external constant',
    rules: [
      { on: 'external_const', goTo: 'AFTER_EXTERNAL_CONSTANT' },
      { on: 'public', goTo: 'AFTER_PUBLIC' },
      { on: 'public_const', goTo: 'AFTER_PUBLIC_CONSTANT' },
      { on: 'internal', goTo: 'AFTER_INTERNAL' },
      { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]
  }),

  AFTER_PUBLIC: new State({
    name: 'AFTER_PUBLIC',
    after: 'public',
    rules: [
      { on: 'public', goTo: 'AFTER_PUBLIC' },
      { on: 'public_const', goTo: 'AFTER_PUBLIC_CONSTANT' },
      { on: 'internal', goTo: 'AFTER_INTERNAL' },
      { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]
  }),

  AFTER_PUBLIC_CONSTANT: new State({
    name: 'AFTER_PUBLIC_CONSTANT',
    after: 'public constant',
    rules: [
      { on: 'public_const', goTo: 'AFTER_PUBLIC_CONSTANT' },
      { on: 'internal', goTo: 'AFTER_INTERNAL' },
      { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]
  }),

  AFTER_INTERNAL: new State({
    name: 'AFTER_INTERNAL',
    after: 'internal',
    rules: [{ on: 'internal', goTo: 'AFTER_INTERNAL' }, { on: 'private', goTo: 'AFTER_PRIVATE' }]
  }),

  AFTER_PRIVATE: new State({
    name: 'AFTER_PRIVATE',
    after: 'private',
    rules: [{ on: 'private', goTo: 'AFTER_PRIVATE' }]
  })
}

class FunctionOrderAnalysis {
  constructor(contractName, reporter, ruleId) {
    this.curState = STATES.START
    this.reporter = reporter
    this.ruleId = ruleId
    this.contractName = contractName
    this.funcTypeParser = new FuncTypeParser(contractName)
  }

  process(ctx) {
    const name = this.funcTypeParser.funcType(ctx)
    const newState = this.curState.nextState(name)

    if (newState) {
      this.curState = STATES[newState]
    } else {
      const afterState = this.curState.after
      const message = `Function order is incorrect, ${name} function can not go after ${afterState} function.`
      this.reporter.error(ctx, this.ruleId, message)
    }
  }
}

class FuncTypeParser {
  constructor(contractName) {
    this.contractName = contractName
  }

  funcType(ctx) {
    if (ctx.children && ctx.children[0].getText() === 'constructor') {
      return 'constructor'
    } else if (ctx.children && ctx.children[1].constructor.name === 'IdentifierContext') {
      const funcName = ctx.children[1]

      if (funcName.getText() === this.contractName) {
        return 'constructor'
      } else {
        return this.funcModifierType(ctx)
      }
    } else {
      return 'fallback'
    }
  }

  funcModifierType(ctx) {
    const modifiers = ctx.children[3]
    const text = modifiers.getText()

    if (text.includes('external') && includesAnyOf(text, ['pure', 'view', 'constant'])) {
      return 'external_const'
    }

    if (text.includes('external')) {
      return 'external'
    }

    if (text.includes('private')) {
      return 'private'
    }

    if (text.includes('internal')) {
      return 'internal'
    }

    if (includesAnyOf(text, ['pure', 'view', 'constant'])) {
      return 'public_const'
    } else {
      return 'public'
    }
  }
}

function includesAnyOf(text, items) {
  return items.map(i => text.includes(i)).some(i => i)
}

module.exports = FuncOrderChecker
