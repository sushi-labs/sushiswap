class BaseChecker {
  constructor(reporter, ruleId, meta) {
    this.reporter = reporter
    this.ruleId = ruleId
    this.meta = meta
  }

  error(ctx, message) {
    this.reporter.error(ctx, this.ruleId, message)
  }

  errorAt(line, column, message) {
    this.reporter.errorAt(line, column, this.ruleId, message)
  }

  warn(ctx, message) {
    this.reporter.warn(ctx, this.ruleId, message)
  }
}

module.exports = BaseChecker
