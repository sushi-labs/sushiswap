'use client'

import {
  ExploreTokens,
  GetExploreTokens,
  getExploreTokens,
} from '@sushiswap/graph-client/data-api/queries'
import { useQuery } from '@tanstack/react-query'

export function useExploreTokens(args: GetExploreTokens, shouldFetch = true) {
  return useQuery<ExploreTokens>({
    queryKey: ['explore-tokens', args],
    queryFn: async () => await getExploreTokens(args),
    enabled: Boolean(shouldFetch && args.chainId),
  })
}
