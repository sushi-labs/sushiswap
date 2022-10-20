const assert = require('assert')
const linter = require('./../../../lib/index')
const contractWith = require('./../../common/contract-builder').contractWith

describe('Linter - modifier-name-mixedcase', () => {
  it('should raise modifier name error', () => {
    const code = contractWith('modifier owned_by(address a) { }')

    const report = linter.processStr(code, {
      rules: { 'modifier-name-mixedcase': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('mixedCase'))
  })

  it('should not raise modifier name error', () => {
    const code = contractWith('modifier ownedBy(address a) { }')

    const report = linter.processStr(code, {
      rules: { 'modifier-name-mixedcase': 'error' }
    })

    assert.equal(report.errorCount, 0)
  })
})
