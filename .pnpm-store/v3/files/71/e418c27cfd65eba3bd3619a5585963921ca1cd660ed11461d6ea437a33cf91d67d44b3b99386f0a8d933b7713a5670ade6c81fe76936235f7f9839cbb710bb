const assert = require('assert')
const linter = require('./../../../lib/index')
const { funcWith } = require('./../../common/contract-builder')

describe('Linter - statement-indent', () => {
  describe('Incorrect Statements statement-indent', () => {
    require('../../fixtures/align/statements_with_incorrect_indents').forEach(curStatement =>
      it(`${label(curStatement)} should raise statement indentation error`, () => {
        const code = funcWith(curStatement)

        const report = linter.processStr(code, {
          rules: { 'statement-indent': 'error' }
        })

        assert.equal(report.errorCount, 1)
        assert.ok(report.messages[0].message.includes('Statement indentation is incorrect'))
      })
    )
  })

  describe('Correct Statements statement-indent', () => {
    require('../../fixtures/align/statements_with_correct_indents').forEach(curStatement =>
      it(`${label(curStatement)} should not raise statement indentation error`, () => {
        const code = funcWith(curStatement)

        const report = linter.processStr(code, {
          rules: { 'statement-indent': 'error' }
        })

        assert.equal(report.errorCount, 0)
      })
    )
  })

  function label(data) {
    return data.split('\n')[0]
  }
})
