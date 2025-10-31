import {
  type TrendingTokensChainId,
  getTrendingTokensV2,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { type EvmID, EvmToken } from 'sushi/evm'

type UseTrendingTokens = {
  chainIds: TrendingTokensChainId[]
}

export function useTrendingTokensV2({ chainIds }: UseTrendingTokens) {
  const query = useQuery({
    queryKey: ['data-api-trending-list-v2', { chainIds }],
    queryFn: async () => {
      if (!chainIds) throw new Error('chainIds are required')

      const priceMap: Map<EvmID, number> = new Map()
      const trendingTokens = await getTrendingTokensV2({
        chainIds,
      })
      if (trendingTokens?.length) {
        trendingTokens?.forEach((token) => {
          priceMap.set(token.id, token.priceUSD)
        })
      }

      return {
        trendingTokens,
        priceMap: priceMap,
      }
    },
    enabled: Boolean(chainIds && chainIds.length > 0),
    // 1 hour
    staleTime: 3600 * 1000,
  })

  return useMemo(() => {
    return {
      ...query,
      data: query.data?.trendingTokens?.map((token) => new EvmToken(token)),
      priceMap: query.data?.priceMap,
    }
  }, [query])
}
