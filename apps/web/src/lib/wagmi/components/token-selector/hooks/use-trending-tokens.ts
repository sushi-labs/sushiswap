import { getTrendingTokens } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { ChainId } from 'sushi/chain'
import { Token } from 'sushi/currency'

type UseTrendingTokens = {
  chainId: ChainId
}

export function useTrendingTokens({ chainId }: UseTrendingTokens) {
  const query = useQuery({
    queryKey: ['data-api-trending-list', { chainId }],
    queryFn: async () => {
      return getTrendingTokens({
        chainId,
      })
    },
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
