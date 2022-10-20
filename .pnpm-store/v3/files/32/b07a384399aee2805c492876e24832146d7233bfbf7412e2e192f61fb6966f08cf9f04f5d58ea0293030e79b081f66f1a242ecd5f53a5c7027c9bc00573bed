const assert = require('assert')
const { assertErrorMessage, assertNoErrors } = require('./../../common/asserts')
const linter = require('./../../../lib/index')

describe('Linter - array-declaration-spaces', () => {
  it('should raise error when array declaration has spaces', () => {
    const code = require('../../fixtures/align/array_declaration_with_spaces')

    const report = linter.processStr(code, { rules: { 'array-declaration-spaces': 'error' } })

    assert.equal(report.errorCount, 2)
    assertErrorMessage(report, 0, 'Array declaration')
    assertErrorMessage(report, 1, 'Array declaration')
  })

  it('should not raise error for array declaration', () => {
    const code = require('../../fixtures/align/array_declaration')

    const report = linter.processStr(code, { rules: { 'array-declaration-spaces': 'error' } })

    assertNoErrors(report)
  })
})
