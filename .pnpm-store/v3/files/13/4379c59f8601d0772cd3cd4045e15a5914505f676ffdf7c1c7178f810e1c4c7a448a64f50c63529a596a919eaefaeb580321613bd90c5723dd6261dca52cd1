const assert = require('assert')
const linter = require('./../../../lib/index')
const { funcWith } = require('./../../common/contract-builder')
const { assertNoErrors } = require('./../../common/asserts')

describe('Linter - expression-indent', () => {
  describe('Incorrect expression-indent', () => {
    require('../../fixtures/align/expressions_with_incorrect_indents').forEach(curExpr =>
      it(`should raise expression indentation error for ${curExpr}`, () => {
        const code = funcWith(curExpr + ';')

        const report = linter.processStr(code, {
          rules: { 'expression-indent': 'error' }
        })

        assert.equal(report.errorCount, 1)
        assert.ok(report.messages[0].message.includes('Expression indentation is incorrect'))
      })
    )
  })

  describe('Correct expression-indent', () => {
    require('../../fixtures/align/expressions_with_correct_indents').forEach(curExpr =>
      it(`should not raise expression indentation error for ${curExpr}`, () => {
        const code = funcWith(curExpr + ';')

        const report = linter.processStr(code, {
          rules: { 'expression-indent': 'error' }
        })

        assertNoErrors(report, 0)
      })
    )
  })
})
