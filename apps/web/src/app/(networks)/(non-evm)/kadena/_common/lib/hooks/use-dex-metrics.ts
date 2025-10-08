import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { z } from 'zod'

const statsResponseSchema = z.object({
  volumeHistory: z.array(
    z.object({
      value: z.number(),
      timestamp: z.string(),
    }),
  ),
  tvlHistory: z.array(
    z.object({
      value: z.number(),
      timestamp: z.string(),
    }),
  ),
  totalVolumeUsd: z.number(),
  currentTvlUsd: z.number(),
  totalPools: z.number(),
})

export const useDexMetrics = () => {
  return useQuery({
    queryKey: ['kadena-dex-metrics'],
    queryFn: async () => {
      const url = new URL('/kadena/api/dex-metrics', window.location.origin)

      const res = await fetch(url.toString())
      const data = await res.json()
      if (!data) throw new Error('Failed to fetch DEX metrics')

      const parsed = statsResponseSchema.safeParse(data)

      if (!parsed.success) {
        throw new Error('Failed to parse dex metrics response')
      }

      return data
    },
    staleTime: ms('10s'),
  })
}
