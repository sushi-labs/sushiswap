const assert = require('assert')
const { assertErrorMessage, assertNoErrors } = require('./../../common/asserts')
const linter = require('./../../../lib/index')

describe('Linter - two-lines-top-level-separator', () => {
  it('should raise error when contract do not surrounds with two blank lines', () => {
    const code = `
            contract A {}
            
            contract B {}
            `

    const report = linter.processStr(code, {
      rules: { 'two-lines-top-level-separator': 'error' }
    })

    assert.equal(report.errorCount, 2)
    assertErrorMessage(report, 0, 'two blank')
  })

  it('should not raise error when contract do not surrounds with two blank lines', () => {
    const code = `
            contract A {}
            
            
            contract B {}
            
            
            contract C {}
            `

    const report = linter.processStr(code, {
      rules: { 'two-lines-top-level-separator': 'error' }
    })

    assertNoErrors(report)
  })
})
