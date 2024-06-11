'use client'

import { useQuery } from '@tanstack/react-query'
import { getSushiBarHistory } from '../../../../../packages/graph-client/dist/subgraphs/sushi-bar'

export const useBarChartData = (enabled = true) => {
  return useQuery({
    queryKey: ['useBarChartData'],
    queryFn: async () => await getSushiBarHistory({}),
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 86400000, // 24hs
    enabled,
  })
}
