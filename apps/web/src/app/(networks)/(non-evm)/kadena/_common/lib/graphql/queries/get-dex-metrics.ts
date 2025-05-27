export const getDexMetricsQuery = JSON.stringify({
  query: `
    {
      dexMetrics {
        totalPools
        currentTvlUsd
        totalVolumeUsd
        tvlHistory {
          timestamp
          value
        }
        volumeHistory {
          timestamp
          value
        }
      }
    }
  `,
})
