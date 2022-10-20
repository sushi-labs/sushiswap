const assert = require('assert')
const linter = require('./../../../lib/index')
const { assertNoErrors, assertWarnsCount, assertErrorMessage } = require('./../../common/asserts')

describe('Linter - compiler fixed', () => {
  it('should disable fixed compiler error', () => {
    const config = {
      rules: {
        'compiler-fixed': false
      }
    }

    const report = linter.processStr('pragma solidity ^0.4.4;', config)

    assert.equal(report.errorCount, 0)
  })

  it('should change error to warn for fixed compiler issue', () => {
    const config = {
      rules: {
        'compiler-fixed': 'warn'
      }
    }

    const report = linter.processStr('pragma solidity ^0.4.4;', config)

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 1)
    assert.ok(report.messages[0].message.includes('Compiler'))
  })

  it('should change error to warn for fixed compiler issue for array config', () => {
    const config = {
      rules: {
        'compiler-fixed': ['warn']
      }
    }

    const report = linter.processStr('pragma solidity ^0.4.4;', config)

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 1)
    assert.ok(report.messages[0].message.includes('Compiler'))
  })

  it('should disable fixed compiler error', () => {
    const report = linter.processStr('pragma solidity ^0.4.4; // solhint-disable-line', {
      rules: { 'compiler-fixed': 'error' }
    })

    assertNoErrors(report)
  })

  it('should disable fixed compiler error using multiline comment', () => {
    const report = linter.processStr('pragma solidity ^0.4.4; /* solhint-disable-line */', {
      rules: { 'compiler-fixed': 'error' }
    })

    assertNoErrors(report)
  })

  it('should disable only compiler version error', () => {
    const report = linter.processStr(
      `
                // solhint-disable compiler-gt-0_4
                pragma solidity ^0.4.4; 
                pragma solidity 0.3.4; // disabled error: Compiler version must be greater that 0.4
            `,
      {
        rules: { 'compiler-fixed': 'warn' }
      }
    )

    assertWarnsCount(report, 1)
    assertErrorMessage(report, 'Compiler version must be fixed')
  })

  it('should not disable fixed compiler error', () => {
    const report = linter.processStr(
      `
                /* solhint-disable compiler-gt-0_4 */
                pragma solidity ^0.4.4;
                /* solhint-enable compiler-gt-0_4 */
                pragma solidity ^0.4.4; 
            `,
      {
        rules: { 'compiler-fixed': 'warn' }
      }
    )

    assertWarnsCount(report, 2)
    assertErrorMessage(report, 'fixed')
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

  it('should return pragma error', () => {
    const report = linter.processStr('pragma solidity ^0.4.4;', {
      rules: { 'compiler-fixed': 'warn' }
    })

    assertWarnsCount(report, 1)
    assertErrorMessage(report, 'Compiler')
  })
})
