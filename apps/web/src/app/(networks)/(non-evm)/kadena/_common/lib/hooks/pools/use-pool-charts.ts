import {
  type PoolTimeFrame,
  getPoolCharts,
} from '@sushiswap/graph-client/kadena'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'

export const usePoolCharts = ({
  poolId,
  timeFrame,
}: {
  poolId: string | undefined
  timeFrame: PoolTimeFrame
}) => {
  return useQuery({
    queryKey: ['kadena-pool-charts', poolId, timeFrame],
    queryFn: async () => {
      if (!poolId) {
        throw new Error('Pool ID is required')
      }

      const data = await getPoolCharts({
        poolId,
        timeFrame,
      })

      if (!data) {
        throw new Error('Failed to fetch pool chart')
      }

      return data
    },
    enabled: !!poolId,
    staleTime: ms('10s'),
  })
}
