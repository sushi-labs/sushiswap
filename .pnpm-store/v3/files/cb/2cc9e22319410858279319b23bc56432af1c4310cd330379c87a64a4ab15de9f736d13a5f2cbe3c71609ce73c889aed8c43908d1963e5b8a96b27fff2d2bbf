const assert = require('assert')
const {
  assertNoErrors,
  assertErrorCount,
  assertWarnsCount,
  assertErrorMessage
} = require('./../../common/asserts')
const linter = require('./../../../lib/index')

describe('Linter - compiler-gt-0_4', () => {
  it('should disable only one compiler error on next line', () => {
    const report = linter.processStr(
      `
                // solhint-disable-next-line
                pragma solidity ^0.4.4;
                pragma solidity 0.3.4;
            `,
      {
        rules: { 'compiler-gt-0_4': 'error' }
      }
    )

    assertErrorCount(report, 1)
  })

  it('should disable only one compiler error on previous line', () => {
    const report = linter.processStr(
      `
              pragma solidity 0.3.4;
              // solhint-disable-previous-line
              pragma solidity 0.3.4;
          `,
      {
        rules: { 'compiler-gt-0_4': 'error' }
      }
    )

    assertErrorCount(report, 1)
  })

  it('should disable only one compiler error on next line using multiline comment', () => {
    const report = linter.processStr(
      `
                /* solhint-disable-next-line */
                pragma solidity ^0.4.4;
                pragma solidity 0.3.4;
            `,
      {
        rules: { 'compiler-gt-0_4': 'error' }
      }
    )

    assertErrorCount(report, 1)
  })

  it('should disable only one compiler error on previous line using multiline comment', () => {
    const report = linter.processStr(
      `
                pragma solidity ^0.4.4;
                /* solhint-disable-previous-line */
                pragma solidity 0.3.4;
            `,
      {
        rules: { 'compiler-gt-0_4': 'error' }
      }
    )

    assertErrorCount(report, 1)
  })

  it('should disable only one compiler version error', () => {
    const report = linter.processStr(
      `
                /* solhint-disable compiler-gt-0_4 */
                pragma solidity 0.3.4;
                /* solhint-enable compiler-gt-0_4 */
                pragma solidity 0.3.4;
            `,
      {
        rules: { 'compiler-gt-0_4': 'error' }
      }
    )

    assertErrorCount(report, 1)
    assertErrorMessage(report, '0.4')
  })

  it('should disable all errors', () => {
    const report = linter.processStr(
      `
                /* solhint-disable */
                pragma solidity ^0.4.4;
                pragma solidity 0.3.4;
            `,
      {
        rules: { 'compiler-fixed': 'warn', 'compiler-gt-0_4': 'error' }
      }
    )
    assertNoErrors(report)
  })

  it('should disable then enable all errors', () => {
    const report = linter.processStr(
      `
                /* solhint-disable */
                pragma solidity ^0.4.4;
                /* solhint-enable */
                pragma solidity ^0.4.4;
            `,
      {
        rules: { 'compiler-fixed': 'warn', 'compiler-gt-0_4': 'error' }
      }
    )

    assertWarnsCount(report, 1)
    assertErrorMessage(report, 'fixed')
  })

  it('should not erase error', () => {
    const report = linter.processStr('/* solhint-disable-next-line */', {
      rules: { 'compiler-fixed': 'warn', 'compiler-gt-0_4': 'error' }
    })

    assertNoErrors(report)
  })

  it('should return compiler version error', () => {
    const report = linter.processStr('pragma solidity 0.3.4;', {
      rules: { 'compiler-gt-0_4': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.reports[0].message.includes('0.4'))
  })
})
