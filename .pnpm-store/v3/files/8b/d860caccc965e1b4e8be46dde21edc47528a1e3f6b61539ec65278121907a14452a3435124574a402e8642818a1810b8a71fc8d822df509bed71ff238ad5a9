const { assertErrorCount, assertNoErrors, assertErrorMessage } = require('./../../common/asserts')
const linter = require('./../../../lib/index')
const { contractWith, stateDef } = require('./../../common/contract-builder')

describe('Linter - max-states-count', () => {
  it('should raise error when count of states too big', () => {
    const code = require('../../fixtures/best-practises/number-of-states-high')

    const report = linter.processStr(code, {
      rules: { 'max-states-count': ['error', 15] }
    })

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'no more than 15')
  })

  it('should not raise error for count of states that lower that max', () => {
    const code = require('../../fixtures/best-practises/number-of-states-low')

    const report = linter.processStr(code, {
      rules: { 'max-states-count': 'error' }
    })

    assertNoErrors(report)
  })

  it('should not raise error for count of states when it value increased in config', () => {
    const code = contractWith(stateDef(20))

    const report = linter.processStr(code, { rules: { 'max-states-count': ['error', 20] } })

    assertNoErrors(report)
  })
})
