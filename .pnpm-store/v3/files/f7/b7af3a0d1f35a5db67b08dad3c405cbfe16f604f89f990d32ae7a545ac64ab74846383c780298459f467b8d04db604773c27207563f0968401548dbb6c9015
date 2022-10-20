const assert = require('assert')
const { assertErrorMessage, assertNoErrors, assertErrorCount } = require('./../../common/asserts')
const linter = require('./../../../lib/index')

describe('Linter - bracket-align', () => {
  it('should raise error when bracket incorrect aligned', () => {
    const code = require('../../fixtures/align/incorrectly_aligned_forloop_brackets')

    const report = linter.processStr(code, {
      rules: { 'bracket-align': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, 0, 'Open bracket')
  })

  it('should not raise error when function bracket correct aligned', () => {
    const code = require('../../fixtures/align/correctly_aligned_function_brackets')

    const report = linter.processStr(code, { rules: { 'bracket-align': 'error' } })

    assertNoErrors(report)
  })

  it('should raise error when function bracket incorrect aligned', () => {
    const code = require('../../fixtures/align/incorrectly_aligned_function_brackets')

    const report = linter.processStr(code, { rules: { 'bracket-align': 'error' } })

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'bracket')
  })
})
