import { useQuery } from '@tanstack/react-query'
import type { DexMetrics } from '~kadena/_common/types/get-dex-metrics'

export const useDexMetrics = () => {
  return useQuery({
    queryKey: ['dex-metrics'],
    queryFn: async (): Promise<DexMetrics> => {
      const res = await fetch('/kadena/api/metrics')
      const data = await res.json()
      if (!data.success) throw new Error('Failed to fetch DEX metrics')
      return data.data
    },
    staleTime: 60_000, // 1 min
  })
}
