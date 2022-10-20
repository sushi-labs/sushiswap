const fs = require('fs')
const antlr4 = require('antlr4')
const glob = require('glob')
const ignore = require('ignore')
const SolidityLexer = require('./grammar/SolidityLexer').SolidityLexer
const SolidityParser = require('./grammar/SolidityParser').SolidityParser
const Reporter = require('./reporter')
const TreeListener = require('./tree-listener')
const checkers = require('./rules/index')

function processStr(inputStr, config = {}, fileName = '') {
  const chars = new antlr4.InputStream(inputStr)
  const lexer = new SolidityLexer(chars)
  const tokens = new antlr4.CommonTokenStream(lexer)
  const parser = new SolidityParser(tokens)
  parser.buildParseTrees = true

  const tree = parser.sourceUnit()
  const reporter = new Reporter(tokens, config)

  const listener = new TreeListener(checkers(reporter, config, inputStr, fileName))
  antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree)

  return reporter
}

function processFile(file, config) {
  const report = processStr(fs.readFileSync(file).toString(), config, file)
  report.file = file

  return report
}

function processPath(path, config) {
  const ignoreFilter = ignore().add(config.excludedFiles)

  const allFiles = glob.sync(path, {})
  const files = ignoreFilter.filter(allFiles)

  return files.map(curFile => processFile(curFile, config))
}

module.exports = { processPath, processFile, processStr }
