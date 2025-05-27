export type DexMetricEntry = {
  timestamp: string
  value: number
}

export type DexMetrics = {
  totalPools: number
  currentTvlUsd: number
  totalVolumeUsd: number
  tvlHistory: DexMetricEntry[]
  volumeHistory: DexMetricEntry[]
}
