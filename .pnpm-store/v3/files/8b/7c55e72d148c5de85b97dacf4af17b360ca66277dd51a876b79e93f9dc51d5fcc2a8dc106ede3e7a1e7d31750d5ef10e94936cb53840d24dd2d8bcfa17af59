const assert = require('assert')
const { assertErrorMessage, assertNoErrors } = require('./../../common/asserts')
const linter = require('./../../../lib/index')
const { contractWith } = require('./../../common/contract-builder')

describe('Linter - separate-by-one-line-in-contract', () => {
  it('should raise error when items inside contract do not separated by new line', () => {
    const code = contractWith(`
                function a() public {
                }
                function b() public {}
            `)

    const report = linter.processStr(code, {
      rules: { 'separate-by-one-line-in-contract': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, 0, 'must be separated by one line')
  })

  it('should not raise error when items inside contract separated by new line', () => {
    const code = contractWith(`
                function a() public {
                }
                
                // any comment
                function b() public {}
            `)

    const report = linter.processStr(code, {
      rules: { 'separate-by-one-line-in-contract': 'error' }
    })

    assertNoErrors(report)
  })

  it('should not raise error when items inside contract separated by new line with comments', () => {
    const code = contractWith(`
                function a() public {
                }
                
                /**
                 * Function b
                 */
                function b() public {}
            `)

    const report = linter.processStr(code, {
      rules: { 'separate-by-one-line-in-contract': 'error' }
    })

    assertNoErrors(report)
  })
})
