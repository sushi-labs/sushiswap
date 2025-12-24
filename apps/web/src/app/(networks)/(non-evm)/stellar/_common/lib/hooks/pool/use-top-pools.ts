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

/**
 * Helper to find a token by contract address (case-insensitive).
 * Stellar contract addresses are case-insensitive, but the API may return
 * them in lowercase while the frontend stores them in uppercase.
 */
function findTokenByAddress(
  tokens: Record<string, Token>,
  address: string,
): Token | undefined {
  // Direct lookup first (most common case)
  if (tokens[address]) {
    return tokens[address]
  }
  // Try uppercase (Stellar convention)
  const upperAddress = address.toUpperCase()
  if (tokens[upperAddress]) {
    return tokens[upperAddress]
  }
  // Fallback: case-insensitive search
  const lowerAddress = address.toLowerCase()
  for (const [key, token] of Object.entries(tokens)) {
    if (key.toLowerCase() === lowerAddress) {
      return token
    }
  }
  return undefined
}

/**
 * Helper to get a token, first from cache then from chain if not found.
 * This ensures we can display pools even if tokens aren't in the known list.
 */
async function getTokenWithFallback(
  tokens: Record<string, Token>,
  address: string,
): Promise<Token | undefined> {
  // Try to find in cache first
  const cachedToken = findTokenByAddress(tokens, address)
  if (cachedToken) {
    return cachedToken
  }
  // Fallback: fetch from chain
  try {
    return await getTokenByContract(address)
  } catch (error) {
    console.warn(`Failed to fetch token ${address}:`, error)
    return undefined
  }
}

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

      // Fetch token info for all pools, including unknown tokens from chain
      const topPoolsWithTokens = await Promise.all(
        topPools.map(async (pool) => {
          const [token0, token1] = await Promise.all([
            getTokenWithFallback(tokens, pool.token0Address),
            getTokenWithFallback(tokens, pool.token1Address),
          ])
          return {
            ...pool,
            token0,
            token1,
          }
        }),
      )

      return topPoolsWithTokens.filter(
        (pool): pool is TopPool => !!pool.token0 && !!pool.token1,
      )
    },
    enabled: !!tokens && !isLoadingTokens && !isPendingTokens,
  })
}
