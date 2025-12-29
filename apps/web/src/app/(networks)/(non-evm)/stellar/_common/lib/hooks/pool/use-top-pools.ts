import {
  type TopNonEvmPools,
  getTopNonEvmPools,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { ChainId } from 'sushi'
import { getTokenByContract } from '../../soroban/token-helpers'
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
    queryKey: ['pools', { chainId: ChainId.STELLAR }, tokenKey],
    queryFn: async () => {
      if (!tokens) {
        return []
      }
      const topPools = await getTopNonEvmPools({
        chainId: ChainId.STELLAR,
      })

      // Fetch token info for all pools
      // getTokenByContract checks dynamic tokens first, then static, then chain
      const topPoolsWithTokens = await Promise.all(
        topPools.map(async (pool) => {
          const [token0, token1] = await Promise.all([
            getTokenByContract(pool.token0Address, tokens),
            getTokenByContract(pool.token1Address, tokens),
          ])
          return {
            ...pool,
            address: pool.address.toUpperCase(),
            token0,
            token1,
          }
        }),
      )

      return topPoolsWithTokens as TopPool[]
    },
    enabled: Boolean(tokens && !isLoadingTokens && !isPendingTokens),
  })
}
