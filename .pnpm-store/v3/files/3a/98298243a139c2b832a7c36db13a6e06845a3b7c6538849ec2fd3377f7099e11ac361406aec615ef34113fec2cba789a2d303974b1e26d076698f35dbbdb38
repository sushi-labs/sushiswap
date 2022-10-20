const assert = require('assert')
const linter = require('./../../../lib/index')

describe('Linter - visibility-modifier-order', () => {
  it('should raise visibility modifier error', () => {
    const code = require('../../fixtures/order/visibility-modifier-not-first')

    const report = linter.processStr(code, {
      rules: { 'visibility-modifier-order': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('Visibility'))
  })

  it('should not raise visibility modifier error', () => {
    const code = require('../../fixtures/order/visibility-modifier-first')

    const report = linter.processStr(code, {
      rules: { 'visibility-modifier-order': 'error' }
    })

    assert.equal(report.errorCount, 0)
  })
})
