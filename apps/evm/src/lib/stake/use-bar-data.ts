'use client'

import { useQuery } from '@tanstack/react-query'
import { getSushiBar } from '../../../../../packages/graph-client/dist/subgraphs/sushi-bar'

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
