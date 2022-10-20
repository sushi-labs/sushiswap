const assert = require('assert')
const { assertNoWarnings, assertErrorMessage, assertWarnsCount } = require('./../../common/asserts')
const linter = require('./../../../lib/index')
const { contractWith, funcWith, multiLine } = require('./../../common/contract-builder')

describe('Linter - no-unused-vars', () => {
  const UNUSED_VARS = [
    contractWith('function a(uint a, uint b) public { b += 1; }'),
    funcWith('uint a = 0;'),
    funcWith('var (a) = 1;'),
    contractWith('function a(uint a, uint b) public { uint c = a + b; }')
  ]

  UNUSED_VARS.forEach(curData =>
    it(`should raise warn for vars ${label(curData)}`, () => {
      const report = linter.processStr(curData, {
        rules: { 'no-unused-vars': 'warn' }
      })

      assertWarnsCount(report, 1)
      assertErrorMessage(report, 'unused')
    })
  )

  const USED_VARS = [
    contractWith('function a(uint a) public { uint b = bytes32(a); b += 1; }'),
    contractWith('function a() public returns (uint c) { return 1; }'),
    contractWith('function a(uint d) public returns (uint c) { }'),
    contractWith('function a(uint a, uint c) public returns (uint c);'),
    contractWith(
      'function a(address a) internal { assembly { t := eq(a, and(mask, calldataload(4))) } }'
    ),
    contractWith(
      multiLine(
        'function a() public view returns (uint, uint) {',
        '  return (1, 2);                               ',
        '}                                              ',
        '                                               ',
        'function b() public view returns (uint, uint) {',
        '  (uint c, uint d) = a();                      ',
        '  return (c, d);                               ',
        '}                                              '
      )
    ),
    contractWith(
      multiLine(
        'function a() public view returns (uint, uint) {    ',
        '  return (1, 2);                                   ',
        '}                                                  ',
        '                                                   ',
        'function b() public view returns (uint c, uint d) {',
        '  (c, d) = a();                                    ',
        '  return (c, d);                                   ',
        '}                                                  '
      )
    )
  ]

  USED_VARS.forEach(curData =>
    it(`should not raise warn for vars ${label(curData)}`, () => {
      const report = linter.processStr(curData, {
        rules: { 'no-unused-vars': 'warn' }
      })

      assertNoWarnings(report)
    })
  )

  it('should raise incorrect var name error', () => {
    const code = funcWith('var (a, B);')

    const report = linter.processStr(code, {
      rules: { 'no-unused-vars': 'error', 'var-name-mixedcase': 'error' }
    })

    assert.ok(report.errorCount > 0)
    assert.ok(report.messages.map(i => i.message).some(i => i.includes('name')))
  })

  it('should raise incorrect var name error for typed declaration', () => {
    const code = funcWith('uint B = 1;')

    const report = linter.processStr(code, {
      rules: { 'no-unused-vars': 'error', 'var-name-mixedcase': 'error' }
    })

    assert.ok(report.errorCount > 0)
    assert.ok(report.messages.map(i => i.message).some(i => i.includes('name')))
  })

  it('should raise incorrect var name error for state declaration', () => {
    const code = contractWith('uint32 private D = 10;')

    const report = linter.processStr(code, {
      rules: { 'no-unused-vars': 'error', 'var-name-mixedcase': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('Variable name'))
  })

  it('should not raise var name error for constants', () => {
    const code = contractWith('uint32 private constant D = 10;')

    const report = linter.processStr(code, {
      rules: { 'no-unused-vars': 'error', 'var-name-mixedcase': 'error' }
    })

    assert.equal(report.errorCount, 0)
  })

  it('should raise forbidden name error', () => {
    const code = funcWith('uint l = 0;')

    const report = linter.processStr(code, {
      rules: { 'no-unused-vars': 'error', 'use-forbidden-name': 'error' }
    })

    assert.equal(report.errorCount, 2)
    assert.ok(report.messages[0].message.includes('Avoid to use'))
  })

  function label(data) {
    const items = data.split('\n')
    const lastItemIndex = items.length - 1
    const labelIndex = Math.floor(lastItemIndex / 5) * 4
    return items[labelIndex]
  }
})
