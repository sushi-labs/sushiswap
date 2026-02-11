import {
  type TopNonEvmPools,
  getTopNonEvmPools,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { ChainId } from 'sushi'
import { getPoolInfoFromContract } from '../../soroban/pool-helpers'
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

      // Fetch token info and actual fee from contract for all pools
      // getTokenByContract checks dynamic tokens first, then static, then chain
      const topPoolsWithTokens = await Promise.all(
        topPools.map(async (pool) => {
          const [token0, token1, contractData] = await Promise.all([
            getTokenByContract(pool.token0Address, tokens),
            getTokenByContract(pool.token1Address, tokens),
            getPoolInfoFromContract(pool.address).catch(() => null),
          ])

          // Use the fee from the contract if available (convert to decimal), otherwise fall back to API
          const swapFee = contractData
            ? contractData.fee / 1_000_000
            : pool.swapFee

          return {
            ...pool,
            address: pool.address.toUpperCase(),
            token0,
            token1,
            swapFee,
          }
        }),
      )

      return topPoolsWithTokens as TopPool[]
    },
    enabled: Boolean(tokens && !isLoadingTokens && !isPendingTokens),
  })
}
