'use client'

import { useQuery } from '@tanstack/react-query'
import { getTokenAnalysis, GetTokenAnalysis, TokenAnalysis } from '@sushiswap/graph-client/data-api/queries/token-list-submission'

export function useTokenAnalysis(
  args: Partial<GetTokenAnalysis>,
  shouldFetch = true,
) {
  return useQuery<TokenAnalysis>({
    queryKey: ['token-analysis', args],
    queryFn: async () => await getTokenAnalysis(args as GetTokenAnalysis),
    enabled: Boolean(shouldFetch && args.chainId && args.address),
  })
}
