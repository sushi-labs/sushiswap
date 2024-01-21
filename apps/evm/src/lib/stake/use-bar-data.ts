'use client'

import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import { useQuery } from '@tanstack/react-query'

const sdk = getBuiltGraphSDK()

export const useBarData = (enabled = true) => {
  return useQuery({
    queryKey: ['useBarData'],
    queryFn: async () => await sdk.Bar(),
    keepPreviousData: true,
    staleTime: 30000,
    cacheTime: 86400000, // 24hs
    enabled,
  })
}
