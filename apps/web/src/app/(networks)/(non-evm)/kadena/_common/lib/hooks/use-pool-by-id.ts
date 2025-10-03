import type {
  GetPoolResponse,
  GetPoolTimeframe,
} from '@sushiswap/graph-client/kadena'
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

      const timeFrame = timeFrameMap[poolByIdChartTimeFrame] || 'DAY'

      const url = new URL(
        '/kadena/api/pools/pool-by-id',
        window.location.origin,
      )
      url.searchParams.set('poolId', poolId)
      url.searchParams.set('timeFrame', timeFrame)
      url.searchParams.set('first', String(first || 1))

      const res = await fetch(url.toString())
      const data = (await res.json()) as GetPoolResponse

      return data
    },
    enabled: Boolean(poolId),
    staleTime: ms('30s'),
  })
}
