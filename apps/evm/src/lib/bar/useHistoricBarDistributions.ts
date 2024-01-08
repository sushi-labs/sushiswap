'use client'

import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import { useInfiniteQuery } from '@tanstack/react-query'

const sdk = getBuiltGraphSDK()

const fetchDistributions = async ({ pageParam = 0 }) => {
  const results = await sdk.Servings({ skip: pageParam })

  return results.servings
}

export const useHistoricBarDistributions = (enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['useHistoricBarDistributions'],
    queryFn: fetchDistributions,
    getNextPageParam: (_, pages) => pages.length,
    keepPreviousData: true,
    staleTime: 30000,
    cacheTime: 86400000, // 24hs
    enabled,
  })
}

export type HistoricBarDistribution = Awaited<
  ReturnType<typeof fetchDistributions>
>[number]
