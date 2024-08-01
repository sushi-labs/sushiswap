'use client'

import { getSushiBar } from '@sushiswap/graph-client/sushi-bar'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useBarData = (enabled = true) => {
  return useQuery({
    queryKey: ['useBarData'],
    queryFn: async () => await getSushiBar({}),
    placeholderData: keepPreviousData,
    staleTime: 30000,
    gcTime: 86400000, // 24hs
    enabled,
  })
}
