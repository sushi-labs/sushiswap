import {
  type TopNonEvmPools,
  getTopNonEvmPools,
} from '@sushiswap/graph-client/data-api'
import { useQueries, useQuery } from '@tanstack/react-query'
import { ChainId } from 'sushi'
import { getPoolDirectSDK } from '../../soroban'
import { getTokenByContract } from '../../soroban/token-helpers'
import type { Token } from '../../types/token.type'
import { useCommonTokens } from '../token'

export type TopPool = TopNonEvmPools[number] & { token0: Token; token1: Token }

export function useTopPools({ isLegacy = false }: { isLegacy?: boolean } = {}) {
  const {
    data: tokens,
    isLoading: isLoadingTokens,
    isPending: isPendingTokens,
  } = useCommonTokens()
  const tokenKey = tokens
    ? Object.keys(tokens).toSorted().join(',')
    : 'no-tokens'
  const {
    data: topPools = [],
    isLoading: topPoolsLoading,
    isPending: topPoolsPending,
    isFetching: topPoolsFetching,
    error: topPoolsError,
    refetch: refetchTopPools,
  } = useQuery<TopPool[]>({
    queryKey: ['stellar', 'top-pools', 'with-token-data', tokenKey],
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

  const topPoolIsLegacyQueries = useQueries({
    queries: topPools.map((topPool) => ({
      queryKey: ['stellar', 'top-pools', 'is-legacy', topPool.address],
      queryFn: async (): Promise<{
        topPoolAddress: string
        isLegacy: boolean
      }> => {
        const legacyPoolAddress = await getPoolDirectSDK({
          tokenA: topPool.token0.contract,
          tokenB: topPool.token1.contract,
          fee: topPool.swapFee * 1000000,
          isLegacy: true,
        })
        return {
          topPoolAddress: topPool.address,
          isLegacy: legacyPoolAddress === topPool.address,
        }
      },
      enabled: Boolean(!topPoolsPending && !topPoolsError),
      staleTime: Number.POSITIVE_INFINITY,
      retry: 1,
    })),
  })

  return {
    data: topPools.filter((pool) => {
      const topPoolExistsStatusQuery = topPoolIsLegacyQueries.find(
        (q) => q.data?.topPoolAddress === pool.address,
      )
      if (!topPoolExistsStatusQuery || !topPoolExistsStatusQuery.data) {
        return false
      }
      return isLegacy === topPoolExistsStatusQuery.data.isLegacy
    }),
    isLoading:
      topPoolsLoading || topPoolIsLegacyQueries.some((q) => q.isLoading),
    isFetching:
      topPoolsFetching || topPoolIsLegacyQueries.some((q) => q.isFetching),
    isPending:
      topPoolsPending || topPoolIsLegacyQueries.some((q) => q.isPending),
    error: topPoolsError,
    refetch: refetchTopPools,
  }
}
