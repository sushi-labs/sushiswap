const { assertErrorMessage, assertNoErrors, assertErrorCount } = require('./../../common/asserts')
const { funcWith } = require('../../common/contract-builder')
const linter = require('./../../../lib/index')

describe('Linter - no-spaces-before-semicolon', () => {
  require('../../fixtures/align/expressions_with_incorrect_semicolon_align')
    .map(exp => funcWith(exp))
    .forEach(curExpr =>
      it('should raise error when semicolon incorrect aligned', () => {
        const report = linter.processStr(curExpr, {
          rules: { 'no-spaces-before-semicolon': 'error' }
        })

        assertErrorCount(report, 1)
        assertErrorMessage(report, 'Semicolon must not have spaces before')
      })
    )

  require('../../fixtures/align/expressions_with_correct_semicolon_align')
    .map(exp => funcWith(exp))
    .forEach(curExpr =>
      it('should raise error when semicolon incorrect aligned', () => {
        const report = linter.processStr(curExpr, {
          rules: { 'no-spaces-before-semicolon': 'error' }
        })

        assertNoErrors(report)
      })
    )
})
