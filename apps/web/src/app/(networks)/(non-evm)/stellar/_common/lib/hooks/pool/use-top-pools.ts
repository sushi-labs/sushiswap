import {
  type TopNonEvmPools,
  getTopNonEvmPools,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { Token } from '../../types/token.type'
import { useCommonTokens } from '../token'

export type TopPool = TopNonEvmPools[number] & { token0: Token; token1: Token }

export function useTopPools() {
  const {
    data: tokens,
    isLoading: isLoadingTokens,
    isPending: isPendingTokens,
  } = useCommonTokens()
  const tokenKey = tokens
    ? Object.keys(tokens).toSorted().join(',')
    : 'no-tokens'
  return useQuery<TopPool[]>({
    queryKey: ['pools', { chainId: 'stellar' }, tokenKey],
    queryFn: async () => {
      if (!tokens) {
        return []
      }
      const topPools = await getTopNonEvmPools({
        chainId: 'stellar',
      })
      const topPoolsWithTokens = topPools.map((pool) => ({
        ...pool,
        token0: tokens[pool.token0Address]!,
        token1: tokens[pool.token1Address]!,
      }))
      return topPoolsWithTokens
    },
    enabled: !isLoadingTokens && !isPendingTokens,
  })
}
