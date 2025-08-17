export type PoolTimeFrame = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'ALL'
export const getPoolCharts = ({
  poolId,
  timeFrame = 'DAY',
}: {
  poolId: string
  timeFrame: PoolTimeFrame
}) => {
  return JSON.stringify({
    query: `
      query GetPoolChart($poolId: ID!, $timeFrame: TimeFrame = DAY) {
        pool(id: $poolId) {
          charts(timeFrame: $timeFrame) {
            volume { timestamp value }
            tvl { timestamp value }
            fees { timestamp value }
          }
        }
      }
    `,
    variables: {
      poolId,
      timeFrame,
    },
  })
}
