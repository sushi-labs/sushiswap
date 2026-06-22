import {
  type StellarPools,
  getStellarPools,
} from '@sushiswap/graph-client/data-api'
import { useQueries, useQuery } from '@tanstack/react-query'
import { StellarChainId, StellarToken } from 'sushi/stellar'
import { getPoolDirectSDK } from '../../soroban'

type StellarPoolToken = StellarPools[number]['token0']

function createStellarPoolToken(token: StellarPoolToken): StellarToken {
  return new StellarToken({
    chainId: StellarChainId.STELLAR,
    address: token.address,
    symbol: token.symbol,
    name: token.name,
    decimals: token.decimals,
    issuer: token.stellarMetadata.issuer ?? undefined,
    metadata: {
      approved: token.approved,
      domain: token.stellarMetadata.domain ?? undefined,
    },
  })
}

export type StellarPool = ReturnType<typeof useStellarPools>['data'][number]

export function useStellarPools({
  isLegacy = false,
}: { isLegacy?: boolean } = {}) {
  const {
    data: topPools = [],
    isLoading: topPoolsLoading,
    isPending: topPoolsPending,
    isFetching: topPoolsFetching,
    error: topPoolsError,
    refetch: refetchTopPools,
  } = useQuery({
    queryKey: ['stellar', 'top-pools'],
    queryFn: async () => {
      const topPools = await getStellarPools({
        chainId: StellarChainId.STELLAR,
      })

      return topPools.map((pool) => {
        const token0 = createStellarPoolToken(pool.token0)
        const token1 = createStellarPoolToken(pool.token1)

        return {
          ...pool,
          token0,
          token1,
          isIncentivized: pool.incentiveApr > 0,
        }
      })
    },
  })

  const topPoolIsLegacyQueries = useQueries({
    queries: topPools.map((topPool) => ({
      queryKey: ['stellar', 'top-pools', 'is-legacy', topPool.address],
      queryFn: async (): Promise<{
        topPoolAddress: string
        isLegacy: boolean
      }> => {
        const legacyPoolAddress = await getPoolDirectSDK({
          tokenA: topPool.token0.address,
          tokenB: topPool.token1.address,
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
