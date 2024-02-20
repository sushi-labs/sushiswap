export class CPUUsageStatistics {
  updateInterval: number
  lastUpdateTime = 0
  lastUpdateUsage = 0
  lastUtilisation = 0

  constructor(updateInterval: number) {
    this.updateInterval = updateInterval
  }

  start() {
    this._updateStatistics()
  }

  _updateStatistics() {
    const newTime = Date.now()
    const newUsage = this._getUsage()
    const newUtilisation = Math.round(
      (newUsage - this.lastUpdateUsage) / (newTime - this.lastUpdateTime) / 10,
    )
    if (this.lastUpdateTime !== 0) {
      console.log(
        `CPU usage last ${Math.round(
          (newTime - this.lastUpdateTime) / 1000,
        )}s: ${newUtilisation}%`,
      )
    }
    this.lastUpdateTime = newTime
    this.lastUpdateUsage = newUsage
    this.lastUtilisation = newUtilisation
    setTimeout(() => this._updateStatistics(), this.updateInterval)
  }

  _getUsage() {
    const { user, system } = process.cpuUsage()
    return user + system
  }
}
