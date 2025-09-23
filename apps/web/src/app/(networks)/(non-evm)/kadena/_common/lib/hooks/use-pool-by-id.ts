import { type GetPoolTimeframe, getPool } from '@sushiswap/graph-client/kadena'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import {
  type PoolByIdChartTimeFrame,
  usePoolState,
} from '~kadena/pool/pool-provider'

const timeFrameMap: Record<PoolByIdChartTimeFrame, GetPoolTimeframe> = {
  '1D': 'DAY',
  '1W': 'WEEK',
  '1M': 'MONTH',
  '1Y': 'YEAR',
  ALL: 'ALL',
}

export const usePoolById = ({
  poolId,
  timeFrame = 'DAY',
  first = 1,
}: {
  poolId: string | undefined
  timeFrame?: GetPoolTimeframe
  first?: number
}) => {
  const { poolByIdChartTimeFrame } = usePoolState()

  return useQuery({
    queryKey: ['kadena-pool-by-id', poolId, timeFrame, first],
    queryFn: async () => {
      if (!poolId) {
        throw new Error('Pool ID is required')
      }

      const data = await getPool({
        poolId,
        timeFrame: timeFrameMap[poolByIdChartTimeFrame],
        first,
      })

      return data
    },
    enabled: Boolean(poolId),
    staleTime: ms('30s'),
  })
}
