export class PricesRequestStatistics {
  lastInterval: number

  startTimeLast = 0
  knownPriceRequests = 0
  unKnownPriceRequests = 0
  allPricesRequests = 0

  constructor(lastInterval: number) {
    this.lastInterval = lastInterval
  }

  start() {
    this._processLastStatistics()
  }

  addKnownPriceRequest() {
    this.knownPriceRequests += 1
  }

  addUnKnownPriceRequest() {
    this.unKnownPriceRequests += 1
  }

  addAllPricesRequest() {
    this.allPricesRequests += 1
  }

  private _processLastStatistics() {
    const now = Date.now()
    if (
      this.knownPriceRequests ||
      this.unKnownPriceRequests ||
      this.allPricesRequests
    ) {
      console.log(
        `Prices requests last ${Math.round(
          (now - this.startTimeLast) / 1000,
        )}s: ${this.allPricesRequests} all prices, ${
          this.knownPriceRequests
        } known price, ${this.unKnownPriceRequests} unknown price`,
      )

      this.knownPriceRequests = 0
      this.unKnownPriceRequests = 0
      this.allPricesRequests = 0
    }
    this.startTimeLast = now
    setTimeout(() => this._processLastStatistics(), this.lastInterval)
  }
}
