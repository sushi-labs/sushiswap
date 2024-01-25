'use client'

import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import { useQuery } from '@tanstack/react-query'

const sdk = getBuiltGraphSDK()

export const useBarChartData = (enabled = true) => {
  return useQuery({
    queryKey: ['useBarChartData'],
    queryFn: async () => await sdk.BarHistory(),
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 86400000, // 24hs
    enabled,
  })
}
