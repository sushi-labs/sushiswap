const assert = require('assert')
const linter = require('./../../../lib/index')
const contractWith = require('./../../common/contract-builder').contractWith

describe('Linter - func-param-name-mixedcase', () => {
  it('should raise incorrect func param name error', () => {
    const code = contractWith('function funcName (uint A) public {}')

    const report = linter.processStr(code, {
      rules: { 'func-param-name-mixedcase': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('param'))
  })

  it('should raise var name error for event arguments illegal styling', () => {
    const code = contractWith('event Event1(uint B);')

    const report = linter.processStr(code, {
      rules: { 'func-param-name-mixedcase': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('mixedCase'))
  })
})
