const CommentDirectiveParser = require('./comment-directive-parser')

class Reporter {
  constructor(tokenStream, config) {
    this.commentDirectiveParser = new CommentDirectiveParser(tokenStream)
    this.reports = []
    this.tokenStream = tokenStream
    this.config = config.rules || {}
  }

  addReport(line, column, severity, message, ruleId) {
    this.reports.push({ line, column, severity, message, ruleId })
  }

  addMessage(interval, defaultSeverity, message, ruleId) {
    const line = this.tokenStream.get(interval.start).line
    const charAtLine = this.tokenStream.get(interval.start).column

    this.addMessageExplicitLine(line, charAtLine, defaultSeverity, message, ruleId)
  }

  addMessageExplicitLine(line, column, defaultSeverity, message, ruleId) {
    const configSeverity = this.severityOf(ruleId)

    if (this.config[ruleId] !== false && this.commentDirectiveParser.isRuleEnabled(line, ruleId)) {
      this.addReport(line, column + 1, configSeverity || defaultSeverity, message, ruleId)
    }
  }

  error(ctx, ruleId, message) {
    this.addMessage(ctx.getSourceInterval(), Reporter.SEVERITY.ERROR, message, ruleId)
  }

  warn(ctx, ruleId, message) {
    this.addMessage(ctx.getSourceInterval(), Reporter.SEVERITY.WARN, message, ruleId)
  }

  errorAt(line, column, ruleId, message) {
    this.addMessageExplicitLine(line, column, Reporter.SEVERITY.ERROR, message, ruleId)
  }

  severityOf(ruleId) {
    const ruleConfig = this.config[ruleId]
    let curSeverity

    if (ruleConfig && ruleConfig instanceof Array) {
      curSeverity = ruleConfig[0]
    } else if (ruleConfig) {
      curSeverity = ruleConfig
    } else {
      return null
    }

    return Reporter.SEVERITY[curSeverity.toUpperCase()]
  }

  get errorCount() {
    return this._countReportsWith(Reporter.SEVERITY.ERROR)
  }

  get warningCount() {
    return this._countReportsWith(Reporter.SEVERITY.WARN)
  }

  _countReportsWith(severity) {
    return this.reports.filter(i => i.severity === severity).length
  }

  get messages() {
    return this.reports.sort((x1, x2) => x1.line - x2.line)
  }

  get filePath() {
    return this.file
  }
}

Reporter.SEVERITY = Object.freeze({ ERROR: 2, WARN: 3 })

module.exports = Reporter
