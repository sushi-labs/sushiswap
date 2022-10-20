const assert = require('assert')
const linter = require('./../../../lib/index')
const contractWith = require('./../../common/contract-builder').contractWith

describe('Linter - func-name-mixedcase', () => {
  it('should raise incorrect func name error', () => {
    const code = contractWith('function AFuncName () public {}')

    const report = linter.processStr(code, {
      rules: { 'func-name-mixedcase': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('mixedCase'))
  })

  it('should dot raise incorrect func name error', () => {
    const code = contractWith('function aFunc1Nam23e () public {}')

    const report = linter.processStr(code, {
      rules: { 'func-name-mixedcase': 'error' }
    })

    assert.equal(report.errorCount, 0)
  })
})
