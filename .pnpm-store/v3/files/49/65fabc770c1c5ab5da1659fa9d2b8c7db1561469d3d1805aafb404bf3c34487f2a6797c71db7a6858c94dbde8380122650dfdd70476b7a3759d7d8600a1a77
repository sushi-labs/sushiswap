const { assertNoWarnings, assertErrorMessage, assertWarnsCount } = require('./../../common/asserts')
const linter = require('./../../../lib/index')
const { contractWith, funcWith } = require('./../../common/contract-builder')

describe('Linter - no-empty-blocks', () => {
  const EMPTY_BLOCKS = [
    funcWith('if (a < b) {  }'),
    contractWith('struct Abc {  }'),
    contractWith('enum Abc {  }'),
    'contract A { }',
    funcWith('assembly {  }')
  ]

  EMPTY_BLOCKS.forEach(curData =>
    it(`should raise warn for empty blocks ${label(curData)}`, () => {
      const report = linter.processStr(curData, {
        rules: { 'no-empty-blocks': 'warn' }
      })

      assertWarnsCount(report, 1)
      assertErrorMessage(report, 'empty block')
    })
  )

  const BLOCKS_WITH_DEFINITIONS = [
    contractWith('function () public payable { make1(); }'),
    funcWith('if (a < b) { make1(); }'),
    contractWith('struct Abc { uint a; }'),
    contractWith('enum Abc { Test1 }'),
    'contract A { uint private a; }',
    funcWith('assembly { "literal" }')
  ]

  BLOCKS_WITH_DEFINITIONS.forEach(curData =>
    it(`should not raise warn for blocks ${label(curData)}`, () => {
      const report = linter.processStr(curData, {
        rules: { 'no-empty-blocks': 'warn' }
      })

      assertNoWarnings(report)
    })
  )

  it('should not raise error for default function', () => {
    const defaultFunction = contractWith('function () public payable {}')
    const report = linter.processStr(defaultFunction, {
      rules: { 'no-empty-blocks': 'warn' }
    })

    assertNoWarnings(report)
  })

  function label(data) {
    const items = data.split('\n')
    const lastItemIndex = items.length - 1
    const labelIndex = Math.floor(lastItemIndex / 5) * 4
    return items[labelIndex]
  }
})
