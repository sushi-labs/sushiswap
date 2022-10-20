const ArrayDeclarationSpacesChecker = require('./array-declaration-spaces')
const BracketAlign = require('./bracket-align')
const ExpressionIndentChecker = require('./expression-indent')
const IndentChecker = require('./indent')
const NoMixTabsAndSpacesChecker = require('./no-mix-tabs-and-spaces')
const NoSpacesBeforeSemicolonChecker = require('./no-spaces-before-semicolon')
const SpaceAfterCommaChecker = require('./space-after-comma')
const StatementsAlignChecker = require('./statement-indent')

module.exports = function checkers(reporter, config) {
  return [
    new ArrayDeclarationSpacesChecker(reporter),
    new BracketAlign(reporter),
    new ExpressionIndentChecker(reporter),
    new IndentChecker(reporter, config),
    new NoMixTabsAndSpacesChecker(reporter, config),
    new NoSpacesBeforeSemicolonChecker(reporter),
    new SpaceAfterCommaChecker(reporter),
    new StatementsAlignChecker(reporter)
  ]
}
