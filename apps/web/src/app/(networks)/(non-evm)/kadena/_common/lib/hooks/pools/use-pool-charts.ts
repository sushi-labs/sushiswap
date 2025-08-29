import { useQuery } from '@tanstack/react-query'
import type { PoolTimeFrame } from '../../graphql/queries/get-pool-by-id-charts'

interface PoolChartsApiResponse {
  success: boolean
  data: {
    charts: {
      volume: { timestamp: string; value: string }[]
      tvl: { timestamp: string; value: string }[]
      fees: { timestamp: string; value: string }[]
    }
  }
}

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
      const url = new URL(
        `/kadena/api/pools/${decodeURIComponent(poolId)}/charts`,
        window.location.origin,
      )
      url.searchParams.set('timeFrame', timeFrame)

      const res = await fetch(url.toString())
      const json: PoolChartsApiResponse = await res.json()

      if (!json.success) {
        console.error('Failed to fetch pool transactions:', json)
        throw new Error('Failed to fetch pool transactions')
      }

      return json.data
    },
    enabled: !!poolId,
    staleTime: (60 * 1000) / 6,
  })
}
