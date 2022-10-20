const assert = require('assert')
const {
  assertNoErrors,
  assertErrorCount,
  assertWarnsCount,
  assertErrorMessage
} = require('./../../common/asserts')
const linter = require('./../../../lib/index')

describe('Linter - compiler-version', () => {
  it('should disable only one compiler error on next line', () => {
    const report = linter.processStr(
      `
                // solhint-disable-next-line
                pragma solidity ^0.4.4;
                pragma solidity 0.3.4;
            `,
      {
        rules: { 'compiler-version': ['error', '^0.5.2'] }
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
        rules: { 'compiler-version': ['error', '^0.5.2'] }
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
        rules: { 'compiler-version': ['error', '^0.5.2'] }
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
        rules: { 'compiler-version': ['error', '^0.5.2'] }
      }
    )

    assertErrorCount(report, 1)
  })

  it('should disable only one compiler version error', () => {
    const report = linter.processStr(
      `
                /* solhint-disable compiler-version */
                pragma solidity 0.3.4;
                /* solhint-enable compiler-version */
                pragma solidity 0.3.4;
            `,
      {
        rules: { 'compiler-version': ['error', '^0.5.2'] }
      }
    )

    assertErrorCount(report, 1)
    assertErrorMessage(report, '0.5.2')
  })

  it('should disable all errors', () => {
    const report = linter.processStr(
      `
                /* solhint-disable */
                pragma solidity ^0.4.4;
                pragma solidity 0.3.4;
            `,
      {
        rules: { 'compiler-fixed': 'warn', 'compiler-version': ['error', '^0.5.2'] }
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
        rules: { 'compiler-fixed': 'warn', 'compiler-version': ['error', '^0.5.2'] }
      }
    )

    assertWarnsCount(report, 1)
    assertErrorMessage(report, 'fixed')
  })

  it('should not erase error', () => {
    const report = linter.processStr('/* solhint-disable-next-line */', {
      rules: { 'compiler-fixed': 'warn', 'compiler-version': ['error', '^0.5.2'] }
    })

    assertNoErrors(report)
  })

  it('should return compiler version error', () => {
    const report = linter.processStr('pragma solidity 0.3.4;', {
      rules: { 'compiler-version': ['error', '^0.5.2'] }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.reports[0].message.includes('0.5.2'))
  })

  it('should not report compiler version error on exact match', () => {
    const report = linter.processStr('pragma solidity 0.5.2;', {
      rules: { 'compiler-version': ['error', '0.5.2'] }
    })

    assert.equal(report.errorCount, 0)
  })

  it('should not report compiler version error on range match', () => {
    const report = linter.processStr('pragma solidity ^0.5.2;', {
      rules: { 'compiler-version': ['error', '^0.5.2'] }
    })

    assert.equal(report.errorCount, 0)
  })

  it('should not report compiler version error on patch bump', () => {
    const report = linter.processStr('pragma solidity 0.5.3;', {
      rules: { 'compiler-version': ['error', '^0.5.2'] }
    })

    assert.equal(report.errorCount, 0)
  })

  it('should report compiler version error on minor bump', () => {
    const report = linter.processStr('pragma solidity 0.6.0;', {
      rules: { 'compiler-version': ['error', '^0.5.2'] }
    })

    assert.equal(report.errorCount, 1)
  })
})
