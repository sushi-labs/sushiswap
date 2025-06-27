import {
  type TrendingTokensChainId,
  getTrendingTokensV2,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Token } from 'sushi/currency'

type UseTrendingTokens = {
  chainIds: TrendingTokensChainId[] | undefined
}

export function useTrendingTokensV2({ chainIds }: UseTrendingTokens) {
  const query = useQuery({
    queryKey: ['data-api-trending-list-v2', { chainIds }],
    queryFn: async () => {
      if (!chainIds) throw new Error('chainIds are required')

      return getTrendingTokensV2({
        chainIds,
      })
    },
    enabled: Boolean(chainIds && chainIds.length > 0),
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
