export enum ResponseRejectReason {
  WRONG_INPUT_PARAMS = 0,
  UNSUPPORTED_TOKENS = 1,
  SERVER_OVERLOADED = 2,
  UNKNOWN_EXCEPTION = 3,
}

export class RequestStatistics {
  totalInterval: number
  lastInterval: number

  startTime = 0
  total = 0
  rejected = 0
  processedKnownTokens = 0
  processedUnKnownTokens = 0
  timeTotalKnownTokens = 0
  timeTotalUnKnownTokens = 0

  startTimeLast = 0
  totalLast = 0
  rejectedLast = 0
  processedKnownTokensLast = 0
  processedUnKnownTokensLast = 0
  timeTotalKnownTokensLast = 0
  timeTotalUnKnownTokensLast = 0

  rejects: number[]

  constructor(lastInterval: number, totalInterval: number) {
    this.totalInterval = totalInterval
    this.lastInterval = lastInterval
    this.rejects = []
    this.rejects[ResponseRejectReason.WRONG_INPUT_PARAMS] = 0
    this.rejects[ResponseRejectReason.UNSUPPORTED_TOKENS] = 0
    this.rejects[ResponseRejectReason.SERVER_OVERLOADED] = 0
    this.rejects[ResponseRejectReason.UNKNOWN_EXCEPTION] = 0
  }

  start() {
    this._processLastStatistics()
    this._processTotalStatistics()
    this.startTime = Date.now()
    this.startTimeLast = this.startTime
  }

  _processTotalStatistics() {
    if (this.total > 0) {
      const time = Date.now() - this.startTime
      const days = Math.floor(time / 24 / 3600 / 1000)
      const hours = Math.floor(time / 3600 / 1000) - days * 24
      const mins = Math.floor(time / 60 / 1000) - (days * 24 + hours) * 60
      const timeHuman = [
        days > 0 ? `${days}d` : '',
        hours > 0 ? `${hours}h` : '',
        mins > 0 ? `${mins}m` : '',
      ]
        .filter((s) => s !== '')
        .join(' ')
      const processed = this.processedKnownTokens + this.processedUnKnownTokens
      const timeKnownAvg =
        this.processedKnownTokens > 0
          ? `(${Math.round(
              this.timeTotalKnownTokens / this.processedKnownTokens,
            )}ms)`
          : ''
      const timeUnKnownAvg =
        this.processedUnKnownTokens > 0
          ? `(${Math.round(
              this.timeTotalUnKnownTokens / this.processedUnKnownTokens,
            )}ms)`
          : ''
      const load = Math.round(
        ((this.timeTotalKnownTokens + this.timeTotalUnKnownTokens) / time) *
          100,
      )
      console.log(
        `All Requests (${timeHuman}): ${this.total} total` +
          `, ${processed} processed(tokens: ${this.processedKnownTokens} known${timeKnownAvg}` +
          `, ${this.processedUnKnownTokens} new${timeUnKnownAvg})` +
          `, ${this.rejected} rejected` +
          `, load ${load}%`,
      )
    }
    setTimeout(() => this._processTotalStatistics(), this.totalInterval)
  }

  _processLastStatistics() {
    if (this.total > 0) {
      const now = Date.now()

      const total = this.total - this.totalLast
      const processedKnown =
        this.processedKnownTokens - this.processedKnownTokensLast
      const processedUnKnown =
        this.processedUnKnownTokens - this.processedUnKnownTokensLast
      const processed = processedKnown + processedUnKnown
      const rejected = this.rejected - this.rejectedLast

      const timeKnownAvg =
        processedKnown > 0
          ? `(${Math.round(
              (this.timeTotalKnownTokens - this.timeTotalKnownTokensLast) /
                processedKnown,
            )}ms)`
          : ''
      const timeUnKnownAvg =
        processedUnKnown > 0
          ? `(${Math.round(
              (this.timeTotalUnKnownTokens - this.timeTotalUnKnownTokensLast) /
                processedUnKnown,
            )}ms)`
          : ''
      const load = Math.round(
        ((this.timeTotalKnownTokens -
          this.timeTotalKnownTokensLast +
          this.timeTotalUnKnownTokens -
          this.timeTotalUnKnownTokensLast) /
          (now - this.startTimeLast)) *
          100,
      )

      console.log(
        `All Requests last ${Math.round(
          (now - this.startTimeLast) / 1000,
        )}s: ${total} new, ${processed} processed(tokens: ${processedKnown} known${timeKnownAvg}, ` +
          `${processedUnKnown} new${timeUnKnownAvg}), ${
            this.total -
            this.processedKnownTokens -
            this.processedUnKnownTokens -
            this.rejected
          } pending, ${rejected} rejected, load ${load}%`,
      )

      this.startTimeLast = now
      this.totalLast = this.total
      this.rejectedLast = this.rejected
      this.processedKnownTokensLast = this.processedKnownTokens
      this.timeTotalKnownTokensLast = this.timeTotalKnownTokens
      this.processedUnKnownTokensLast = this.processedUnKnownTokens
      this.timeTotalUnKnownTokensLast = this.timeTotalUnKnownTokens
    }
    setTimeout(() => this._processLastStatistics(), this.lastInterval)
  }

  requestProcessingStart(): number {
    ++this.total
    return performance.now()
  }

  requestRejected(reason: ResponseRejectReason) {
    ++this.rejected
    ++this.rejects[reason]
  }

  requestWasProcessed(startTime: number, knownTokens: boolean) {
    if (knownTokens) {
      ++this.processedKnownTokens
      this.timeTotalKnownTokens += performance.now() - startTime
    } else {
      ++this.processedUnKnownTokens
      this.timeTotalUnKnownTokens += performance.now() - startTime
    }
  }
}

export const requestStatistics = new RequestStatistics(60_000, 3_600_000)
