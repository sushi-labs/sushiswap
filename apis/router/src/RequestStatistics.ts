export class RequestStatistics {
  statObject: string
  lastInterval: number

  startTimeLast = 0
  knownRequests = 0
  unKnownRequests = 0
  allRequests = 0

  constructor(statObject: string, lastInterval: number) {
    this.statObject = statObject
    this.lastInterval = lastInterval
  }

  start() {
    this._processLastStatistics()
  }

  addKnownRequest() {
    this.knownRequests += 1
  }

  addUnKnownRequest() {
    this.unKnownRequests += 1
  }

  addAllRequest() {
    this.allRequests += 1
  }

  private _processLastStatistics() {
    const now = Date.now()
    if (this.knownRequests || this.unKnownRequests || this.allRequests) {
      console.log(
        `${this.statObject} requests last ${Math.round(
          (now - this.startTimeLast) / 1000,
        )}s: ${this.allRequests} all, ${this.knownRequests} known, ${
          this.unKnownRequests
        } unknown`,
      )

      this.knownRequests = 0
      this.unKnownRequests = 0
      this.allRequests = 0
    }
    this.startTimeLast = now
    setTimeout(() => this._processLastStatistics(), this.lastInterval)
  }
}
