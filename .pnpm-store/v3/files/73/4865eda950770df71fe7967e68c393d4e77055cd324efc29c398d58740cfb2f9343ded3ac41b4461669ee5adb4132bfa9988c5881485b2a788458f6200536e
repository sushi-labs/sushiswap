const assert = require('assert')
const linter = require('./../../../lib/index')
const contractWith = require('./../../common/contract-builder').contractWith

describe('Linter - contract-name-camelcase', () => {
  it('should raise struct name error', () => {
    const code = contractWith('struct a {}')

    const report = linter.processStr(code, {
      rules: { 'contract-name-camelcase': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('CamelCase'))
  })

  it('should raise contract name error', () => {
    const code = 'contract a {}'

    const report = linter.processStr(code, {
      rules: { 'contract-name-camelcase': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('CamelCase'))
  })

  it('should raise enum name error', () => {
    const code = contractWith('enum abc {}')

    const report = linter.processStr(code, {
      rules: { 'contract-name-camelcase': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('CamelCase'))
  })
})
