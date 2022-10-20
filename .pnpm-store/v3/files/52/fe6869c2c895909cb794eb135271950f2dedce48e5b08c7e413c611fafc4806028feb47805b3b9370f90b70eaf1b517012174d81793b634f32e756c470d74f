const { typeOf } = require('./tree-traversing')

function isFallbackFunction(ctx) {
  return ctx.children && ctx.children[1] && ctx.children[1].constructor.name !== 'IdentifierContext'
}

function isFunctionDefinition(ctx) {
  return typeOf(ctx) === 'functionDefinition'
}

module.exports = {
  isFallbackFunction,
  isFunctionDefinition
}
