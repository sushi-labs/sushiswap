'use client'

import { getSushiBar } from '@sushiswap/graph-client/sushi-bar'
import { useQuery } from '@tanstack/react-query'

export const useBarData = (enabled = true) => {
  return useQuery({
    queryKey: ['useBarData'],
    queryFn: async () => await getSushiBar({}),
    keepPreviousData: true,
    staleTime: 30000,
    cacheTime: 86400000, // 24hs
    enabled,
  })
}
