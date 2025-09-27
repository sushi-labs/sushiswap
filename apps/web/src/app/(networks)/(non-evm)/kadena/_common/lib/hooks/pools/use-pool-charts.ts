import type { PoolTimeFrame } from '@sushiswap/graph-client/kadena'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { z } from 'zod'

const chartsResponseSchema = z.object({
  charts: z.object({
    fees: z
      .array(
        z.object({
          value: z.number().or(z.string()),
          timestamp: z.string(),
        }),
      )
      .default([]),
    tvl: z
      .array(
        z.object({
          value: z.number().or(z.string()),
          timestamp: z.string(),
        }),
      )
      .default([]),
    volume: z
      .array(
        z.object({
          value: z.number().or(z.string()),
          timestamp: z.string(),
        }),
      )
      .default([]),
  }),
})

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

      const url = new URL('/kadena/api/pools/charts', window.location.origin)
      url.searchParams.set('poolId', poolId)
      url.searchParams.set('timeFrame', timeFrame || 'DAY')

      const res = await fetch(url.toString())
      const data = await res.json()

      if (!data) {
        throw new Error('Failed to fetch pool chart')
      }

      const parsed = chartsResponseSchema.safeParse(data)

      if (!parsed.success) {
        throw new Error('Failed to parse pool chart')
      }

      return parsed.data
    },
    enabled: Boolean(poolId),
    staleTime: ms('10s'),
  })
}
