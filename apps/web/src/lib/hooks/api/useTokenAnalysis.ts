'use client'

import {
  type GetTokenAnalysis,
  type TokenAnalysis,
  getTokenAnalysis,
} from '@sushiswap/graph-client/data-api/queries/token-list-submission'
import { useQuery } from '@tanstack/react-query'
import { isEvmAddress } from 'sushi/evm'

// NOTE: This is not intended to be used anywhere else other than the token listing page, do not replace this with goplusapi requests.
export function useTokenAnalysis(
  args: Partial<GetTokenAnalysis>,
  shouldFetch = true,
) {
  return useQuery<TokenAnalysis>({
    queryKey: ['token-analysis', args],
    queryFn: async () => await getTokenAnalysis(args as GetTokenAnalysis),
    enabled: Boolean(
      shouldFetch && args.chainId && args.address && isEvmAddress(args.address),
    ),
  })
}
