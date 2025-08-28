import { useQuery } from '@tanstack/react-query'
import { PoolChartPeriod } from 'src/ui/pool/PoolChartPeriods'
import type { PoolByIdResponse } from '~kadena/_common/types/get-pool-by-id'
import { usePoolState } from '~kadena/pool/pool-provider'

export const usePoolById = ({
  poolId,
  timeFrame = PoolChartPeriod.Day,
  first = 10,
}: {
  poolId?: string
  timeFrame?: PoolChartPeriod
  first?: number
}) => {
  const { poolByIdChartTimeFrame } = usePoolState()

  return useQuery({
    queryKey: ['kadena-pool-by-id', poolId, timeFrame, first],
    queryFn: async (): Promise<PoolByIdResponse> => {
      const res = await fetch(
        `/kadena/api/pools/${poolId}?timeFrame=${poolByIdChartTimeFrame}&first=${first}`,
      )
      const data = await res.json()
      if (!data.success) throw new Error('Failed to fetch pool')
      return data.data
    },
    enabled: !!poolId,
    staleTime: (20 * 1000) / 6,
  })
}
