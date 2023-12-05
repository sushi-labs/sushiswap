export enum ResponseRejectReason {
  WRONG_INPUT_PARAMS = 0,
  UNSUPPORTED_TOKENS = 1,
}

export class RequestStatistics {
  totalInterval: number
  startTime = 0

  total = 0
  rejected = 0
  processedKnownTokens = 0
  timeTotalKnownTokens = 0
  processedUnKnownTokens = 0
  timeTotalUnKnownTokens = 0

  rejects: number[]

  constructor(totalInterval: number) {
    this.totalInterval = totalInterval
    this.rejects = []
    this.rejects[ResponseRejectReason.WRONG_INPUT_PARAMS] = 0
    this.rejects[ResponseRejectReason.UNSUPPORTED_TOKENS] = 0
  }

  start() {
    this._processTotalStatistics()
    this.startTime = performance.now()
  }

  _processTotalStatistics() {
    if (this.total > 0) {
      const time = performance.now() - this.startTime
      const days = Math.floor(time / 24 / 3600 / 1000)
      const hours = Math.floor(time / 3600 / 1000) - days * 24
      const mins = Math.floor(time / 60 / 1000) - days * 24 * 60 - hours * 60
      const timeHuman = [
        days > 0 ? `${days}d` : '',
        days > 0 && hours > 0 ? `${hours}h` : '',
        `${mins}m`,
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
      console.log(
        `All Requests (${timeHuman}): ${
          this.total
        } total, ${processed} processed(${
          this.processedKnownTokens
        } known tok${timeKnownAvg}, ${
          this.processedUnKnownTokens
        } new tok${timeUnKnownAvg}), ${
          this.total - processed - this.rejected
        } pending or thrown, ${this.rejected} rejected`,
      )
    }
    setTimeout(() => this._processTotalStatistics(), this.totalInterval)
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
