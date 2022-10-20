const { assertNoWarnings, assertErrorMessage, assertWarnsCount } = require('./../../common/asserts')
const linter = require('./../../../lib/index')

describe('Linter - payable-fallback', () => {
  it('should raise warn when fallback is not payable', () => {
    const code = require('../../fixtures/best-practises/fallback-not-payable')

    const report = linter.processStr(code, {
      rules: { 'payable-fallback': 'warn' }
    })

    assertWarnsCount(report, 1)
    assertErrorMessage(report, 'payable')
  })

  it('should not raise warn when fallback is payable', () => {
    const code = require('../../fixtures/best-practises/fallback-payable')

    const report = linter.processStr(code, {
      rules: { 'payable-fallback': 'warn' }
    })

    assertNoWarnings(report)
  })
})
