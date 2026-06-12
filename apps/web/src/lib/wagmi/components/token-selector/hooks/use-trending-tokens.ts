import {
  type TrendingTokensChainId,
  getTrendingTokens,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { createTokenListToken } from './token-list-token'

type UseTrendingTokens<TChainId extends TrendingTokensChainId> = {
  chainId: TChainId | undefined
}

export function useTrendingTokens<TChainId extends TrendingTokensChainId>({
  chainId,
}: UseTrendingTokens<TChainId>) {
  const query = useQuery({
    queryKey: ['data-api-trending-list', { chainId }],
    queryFn: async () => {
      if (!chainId) throw new Error('chainId is required')

      return getTrendingTokens({
        chainId,
      })
    },
    enabled: Boolean(chainId),
    // 1 hour
    staleTime: 3600 * 1000,
  })

  return useMemo(() => {
    if (!query.data || !chainId) {
      return { ...query, data: undefined }
    }

    return {
      ...query,
      data: query.data.map((token) => createTokenListToken(chainId, token)),
    }
  }, [query, chainId])
}
