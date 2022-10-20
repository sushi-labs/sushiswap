const assert = require('assert')
const linter = require('./../../../lib/index')
const contractWith = require('./../../common/contract-builder').contractWith

describe('Linter - func-visibility', () => {
  it('should return required visibility error', () => {
    require('../../fixtures/security/functions-without-visibility').forEach(func => {
      const code = contractWith(func)

      const report = linter.processStr(code, {
        rules: { 'func-visibility': 'warn' }
      })

      assert.equal(report.warningCount, 1)
      assert.ok(report.reports[0].message.includes('visibility'))
    })
  })

  it('should not return required visibility error', () => {
    require('../../fixtures/security/functions-with-visibility').forEach(func => {
      const code = contractWith(func)

      const report = linter.processStr(code, {
        rules: { 'func-visibility': 'warn' }
      })

      assert.equal(report.warningCount, 0)
    })
  })
})
