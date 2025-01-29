import {
  type TrendingTokensChainId,
  getTrendingTokens,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Token } from 'sushi/currency'

type UseTrendingTokens = {
  chainId: TrendingTokensChainId | undefined
}

export function useTrendingTokens({ chainId }: UseTrendingTokens) {
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
    return {
      ...query,
      data: query.data?.map((token) => new Token(token)),
    }
  }, [query])
}
