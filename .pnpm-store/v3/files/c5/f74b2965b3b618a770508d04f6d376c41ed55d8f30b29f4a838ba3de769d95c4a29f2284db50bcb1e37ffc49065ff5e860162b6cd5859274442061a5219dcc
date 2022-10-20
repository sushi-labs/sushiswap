const assert = require('assert')
const linter = require('./../../../lib/index')
const contractWith = require('./../../common/contract-builder').contractWith

describe('Linter - no-simple-event-func-name', () => {
  it('should return error that function and event names are similar I', () => {
    const code = contractWith(`
          event Name1();
          function name1() public payable { }
        `)

    const report = linter.processStr(code, {
      rules: { 'no-simple-event-func-name': 'warn' }
    })

    assert.equal(report.warningCount, 1)
    assert.ok(report.reports[0].message.includes('Event and function names must be different'))
  })

  it('should return error that function and event names are similar II', () => {
    const code = contractWith(`
          function name1() public payable { }
          event Name1();
        `)

    const report = linter.processStr(code, {
      rules: { 'no-simple-event-func-name': 'warn' }
    })

    assert.equal(report.warningCount, 1)
    assert.ok(report.reports[0].message.includes('Event and function names must be different'))
  })
})
