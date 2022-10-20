const assert = require('assert')
const linter = require('./../../../lib/index')
const contractWith = require('./../../common/contract-builder').contractWith
const funcWith = require('./../../common/contract-builder').funcWith

describe('Linter - var-name-mixedcase', () => {
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
})
