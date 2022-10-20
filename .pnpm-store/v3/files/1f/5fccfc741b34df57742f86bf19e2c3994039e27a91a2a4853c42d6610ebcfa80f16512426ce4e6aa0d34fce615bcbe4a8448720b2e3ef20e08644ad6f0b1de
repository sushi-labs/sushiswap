const { assertErrorMessage, assertNoErrors, assertErrorCount } = require('./../../common/asserts')
const linter = require('./../../../lib/index')

describe('Linter - space-after-comma', () => {
  require('../../fixtures/align/expressions_with_incorrect_comma_align').forEach(curExpr =>
    it('should raise error when comma incorrect aligned', () => {
      const report = linter.processStr(curExpr, {
        rules: { 'space-after-comma': 'error' }
      })

      assertErrorCount(report, 1)
      assertErrorMessage(report, 'must be separated')
    })
  )

  require('../../fixtures/align/expressions_with_correct_comma_align').forEach(curExpr =>
    it('should raise error when comma incorrect aligned', () => {
      const report = linter.processStr(curExpr, {
        rules: { 'space-after-comma': 'error' }
      })

      assertNoErrors(report)
    })
  )
})
