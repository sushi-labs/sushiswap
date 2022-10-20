const assert = require('assert')
const { assertErrorMessage, assertNoErrors } = require('./../../common/asserts')
const linter = require('./../../../lib/index')
const { contractWith, multiLine } = require('./../../common/contract-builder')

describe('Linter - indent', () => {
  it('should raise error when line indent is incorrect with tabs', () => {
    const code = '\t\timport "lib.sol";'

    const report = linter.processStr(code, { rules: { indent: ['error', 'tabs'] } })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, 0, 'indent')
  })

  it('should raise error when line indent is incorrect with spaces', () => {
    const code = require('../../fixtures/align/incorrectly_indented_contract')

    const report = linter.processStr(code, { rules: { indent: ['error', 'spaces'] } })

    assert.equal(report.errorCount, 3)
    assertErrorMessage(report, 0, '0')
    assertErrorMessage(report, 1, '4')
    assertErrorMessage(report, 2, '0')
  })

  it('should not raise error for multiline multi variable functions with additional indent', () => {
    const code = require('../../fixtures/align/correctly_indented_contract')

    const report = linter.processStr(code, { rules: { indent: ['error', 'spaces'] } })

    assert.equal(report.errorCount, 0)
  })

  it('should not raise error for multiline multi variable functions with no additional indent', () => {
    const code = multiLine(
      'contract A {                                       ',
      '    function a() public view returns (uint, uint) {',
      '        return (1, 2);                             ',
      '    }                                              ',
      '                                                   ',
      '    function b() public view returns (uint, uint) {',
      '        (                                          ',
      '        uint c,                                    ',
      '        uint d                                     ',
      '        ) = a();                                   ',
      '        return (c, d);                             ',
      '    }                                              ',
      '}                                                  '
    )

    const report = linter.processStr(code, { rules: { indent: ['error', 'spaces'] } })

    assert.equal(report.errorCount, 0)
  })

  it('should raise error when line indent is incorrect for function', () => {
    const code = multiLine(
      '    contract A {                  ',
      '        uint private a;           ',
      '        function A() private {    ',
      '      }                           ',
      '    }                             '
    )

    const report = linter.processStr(code, {
      rules: { indent: ['error', 'spaces'] }
    })

    assert.equal(report.errorCount, 5)
    assertErrorMessage(report, 0, 'Expected indentation of 0')
    assertErrorMessage(report, 1, 'Expected indentation of 4')
    assertErrorMessage(report, 2, 'Expected indentation of 4')
    assertErrorMessage(report, 3, 'Expected indentation of 4')
    assertErrorMessage(report, 4, 'Expected indentation of 0')
  })

  it('should raise error when line indent is incorrect for function with for loop', () => {
    const code = multiLine(
      '                     ', // 1
      '    contract A {                        ', // 2
      '        uint private a;                 ', // 3
      '        function A() private {          ', // 4
      '    for (uint a; a < b; a += 1)         ', // 5
      '            break;                      ', // 6
      '      }                                 ', // 7
      '    }                                   ' // 8
    )

    const report = linter.processStr(code, {
      rules: { indent: ['error', 'spaces'] }
    })

    assert.equal(report.errorCount, 6)
    assertErrorMessage(report, 0, 'Expected indentation of 0')
    assertErrorMessage(report, 1, 'Expected indentation of 4')
    assertErrorMessage(report, 2, 'Expected indentation of 4')
    assertErrorMessage(report, 3, 'Expected indentation of 8')
    assertErrorMessage(report, 4, 'Expected indentation of 4')
    assertErrorMessage(report, 5, 'Expected indentation of 0 spaces')
  })

  it('should raise error when line indent is incorrect for function with for while loop', () => {
    const code = multiLine(
      '                   ', // 1
      '    contract A {                      ', // 2
      '        uint private a;               ', // 3
      '        function A() private {        ', // 4
      '    while (a < b)                     ', // 5
      '             return;                  ', // 6
      '      }                               ', // 7
      '    }                                 ' // 8
    )

    const report = linter.processStr(code, {
      rules: { indent: ['error', 'spaces'] }
    })

    assert.equal(report.errorCount, 7)
    assertErrorMessage(report, 0, 'Expected indentation of 0 spaces')
    assertErrorMessage(report, 1, 'Expected indentation of 4')
    assertErrorMessage(report, 2, 'Expected indentation of 4')
    assertErrorMessage(report, 3, 'Expected indentation of 8')
    assertErrorMessage(report, 4, 'Expected indentation of 12')
    assertErrorMessage(report, 5, 'Expected indentation of 4')
    assertErrorMessage(report, 6, 'Expected indentation of 0')
  })

  it('should raise error when line indent is incorrect for function with for if statement', () => {
    const code = multiLine(
      '                  ', // 1
      '    contract A {                     ', // 2
      '        uint private a;              ', // 3
      '        function A() private {       ', // 4
      '    if (a < b) {                     ', // 5
      '            a += 1;                  ', // 6
      '        b -= 1;                      ', // 7
      '            continue;                ', // 8
      '        }                            ', // 9
      '      }                              ', // 10
      '    }                                ' // 11
    )

    const report = linter.processStr(code, {
      rules: { indent: ['error', 'spaces'] }
    })

    assert.equal(report.errorCount, 7)
    assertErrorMessage(report, 0, 'Expected indentation of 0 spaces')
    assertErrorMessage(report, 1, 'Expected indentation of 4')
    assertErrorMessage(report, 2, 'Expected indentation of 4')
    assertErrorMessage(report, 3, 'Expected indentation of 8')
    assertErrorMessage(report, 4, 'Expected indentation of 12')
    assertErrorMessage(report, 5, 'Expected indentation of 4')
    assertErrorMessage(report, 6, 'Expected indentation of 0')
  })

  it('should not raise error when line indent is correct for function with for if-else statement with spaces', () => {
    const code = multiLine(
      '              ', // 1
      'contract A {                     ', // 2
      '    function A() private {       ', // 3
      '        if (a < b) {             ', // 4
      '            a += 1;              ', // 5
      '        } else {                 ', // 6
      '            b -= 1;              ', // 7
      '        }                        ', // 8
      '    }                            ', // 9
      '}                                ' // 10
    )

    const report = linter.processStr(code, {
      rules: { indent: ['error', 'spaces'] }
    })

    assertNoErrors(report)
  })

  it('should raise error when line indent is not correct for function with for assembly statement', () => {
    const code = multiLine(
      '              ', // 1
      'contract A {                     ', // 2
      '    function A() private {       ', // 3
      '        assembly {               ', // 4
      '         {}                      ', // 5
      '        }                        ', // 6
      '    }                            ', // 7
      '}                                ' // 8
    )

    const report = linter.processStr(code, {
      rules: {
        indent: ['error', 'spaces']
      }
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, 0, 'Indentation is incorrect')
  })

  it('should not raise error when indent is correct for function with non single line header', () => {
    const code = multiLine(
      '              ', // 1
      'contract A {                     ', // 2
      '     function A(                 ', // 3
      '     )                           ', // 4
      '        private                  ', // 5
      '     {                           ', // 6
      '         {                       ', // 7
      '                                 ', // 8
      '        }                        ', // 9
      '    }                            ', // 10
      '}                                ' // 11
    )

    const report = linter.processStr(code, {
      rules: {
        indent: ['error', 'spaces']
      }
    })

    assert.equal(report.errorCount, 4)
    assertErrorMessage(report, 0, 'Expected indentation of 4')
    assertErrorMessage(report, 1, 'Indentation is incorrect')
    assertErrorMessage(report, 2, 'Indentation is incorrect')
    assertErrorMessage(report, 3, 'Expected indentation of 8')
  })

  it('should not raise error when line indent is correct for function with for if-else statement', () => {
    const code = multiLine(
      '               ', // 1
      'contract A {                      ', // 2
      '    function A() private {        ', // 3
      '        if (                      ', // 4
      '            a < b                 ', // 5
      '        ) {                       ', // 6
      '            a += 1;               ', // 7
      '        } else {                  ', // 8
      '            b -= 1;               ', // 9
      '        }                         ', // 10
      '    }                             ', // 11
      '}                                 ' // 12
    )

    const report = linter.processStr(code, {
      rules: { indent: ['error', 'spaces'] }
    })

    assertNoErrors(report)
  })

  it('should not raise error for custom configured indent rules', () => {
    const code = multiLine(
      '',
      'contract A {              ',
      '\tuint private a = 0;     ',
      '\tfunction A() {          ',
      '\t\t\tuint a = 5;         ',
      '\t}                       ',
      '}                         '
    )

    const report = linter.processStr(code, {
      rules: {
        indent: ['warn', 'tabs']
      }
    })

    assert.equal(report.warningCount, 1)
    assertErrorMessage(report, 0, 'Expected indentation of 2 tabs')
  })

  it('should not raise error when function bracket correct aligned', () => {
    const code = contractWith(`
                function a (
                    uint a
                ) 
                    public  
                {
                  continue;
                }
            `)

    const report = linter.processStr(code, { rules: { indent: ['warn', 'tabs'] } })

    assertNoErrors(report)
  })
})
