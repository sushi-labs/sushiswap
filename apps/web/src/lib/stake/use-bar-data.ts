'use client'

import { getSushiBarStats } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'

export const useBarData = (enabled = true) => {
  return useQuery({
    queryKey: ['useBarData'],
    queryFn: async () => await getSushiBarStats({}),
    keepPreviousData: true,
    staleTime: 30000,
    cacheTime: 86400000, // 24hs
    enabled,
  })
}
