const FuncOrderChecker = require('./func-order')
const ImportsOnTopChecker = require('./imports-on-top')
const SeparateByOneLineInContractChecker = require('./separate-by-one-line-in-contract')
const TwoLinesTopLevelSeparatorChecker = require('./two-lines-top-level-separator')
const VisibilityModifierOrderChecker = require('./visibility-modifier-order')

module.exports = function order(reporter) {
  return [
    new FuncOrderChecker(reporter),
    new ImportsOnTopChecker(reporter),
    new SeparateByOneLineInContractChecker(reporter),
    new TwoLinesTopLevelSeparatorChecker(reporter),
    new VisibilityModifierOrderChecker(reporter)
  ]
}
