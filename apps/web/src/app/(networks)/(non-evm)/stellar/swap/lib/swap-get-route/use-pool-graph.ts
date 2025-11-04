import { useQuery } from '@tanstack/react-query'
import {
  getFactoryContractClient,
  getPoolContractClient,
} from '~stellar/_common/lib/soroban/client'
import { CONTRACT_ADDRESSES } from '~stellar/_common/lib/soroban/contract-addresses'
import { getTokenByContract } from '~stellar/_common/lib/soroban/token-helpers'
import type { Vertex } from './types'

/**
 * Build a graph of available pools for routing
 *
 * Returns:
 * - vertices: Map of pool vertices (tokenA|||tokenB -> pool data)
 * - tokenGraph: Map of token adjacency list (token -> connected tokens)
 */
export function usePoolGraph() {
  return useQuery({
    queryKey: ['stellar', 'pool-graph'],
    queryFn: async () => {
      const vertices = new Map<string, Vertex>()
      const tokenGraph = new Map<string, string[]>()

      try {
        // Get factory client to discover pools
        const factoryClient = getFactoryContractClient({
          contractId: CONTRACT_ADDRESSES.FACTORY,
        })

        if (!factoryClient) {
          console.error('Failed to create factory client')
          return { vertices, tokenGraph }
        }

        // For performance, we'll query a subset of known token pairs
        // In production, you'd want to:
        // 1. Query all pools from the factory
        // 2. Cache results
        // 3. Only query active/liquid pools
        const knownTokens = [
          CONTRACT_ADDRESSES.TOKENS.XLM,
          CONTRACT_ADDRESSES.TOKENS.HYPE,
          CONTRACT_ADDRESSES.TOKENS.SUSHI,
          CONTRACT_ADDRESSES.TOKENS.STELLA,
          CONTRACT_ADDRESSES.TOKENS.HYPED,
          CONTRACT_ADDRESSES.TOKENS.HYPEE,
        ]

        const feeTiers = [500, 3000, 10000] // 0.05%, 0.3%, 1%

        // Query all possible pool combinations
        const poolQueries: Promise<void>[] = []

        for (let i = 0; i < knownTokens.length; i++) {
          for (let j = i + 1; j < knownTokens.length; j++) {
            const tokenA = knownTokens[i]
            const tokenB = knownTokens[j]

            for (const fee of feeTiers) {
              poolQueries.push(
                (async () => {
                  try {
                    // Order tokens (smaller address first) to match factory's expectations
                    const [token0, token1] =
                      tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]

                    // Query pool address from factory
                    const poolResult = await factoryClient.get_pool({
                      token_a: token0,
                      token_b: token1,
                      fee,
                    })

                    const poolAddress = poolResult.result

                    if (!poolAddress || poolAddress === '') {
                      // Pool doesn't exist
                      return
                    }

                    // Get pool state
                    const poolClient = getPoolContractClient({
                      contractId: poolAddress,
                    })

                    const [slot0Result, liquidityResult] = await Promise.all([
                      poolClient.slot0(),
                      poolClient.liquidity(),
                    ])

                    const sqrtPriceX96 = slot0Result.result.sqrt_price_x96

                    // Get slot0 data
                    const slot0 = slot0Result.result

                    const tick = Number(slot0.tick || 0)

                    // Calculate approximate reserves from liquidity and sqrt price
                    // For V3/concentrated liquidity: reserve = liquidity / sqrt(price) and reserve1 = liquidity * sqrt(price)
                    // sqrtPrice = sqrtPriceX96 / 2^96
                    const liquidity = BigInt(liquidityResult.result || 0)
                    const sqrtPriceX96BigInt = BigInt(sqrtPriceX96)

                    // Virtual reserves for this liquidity position
                    // reserve0 = L * 2^96 / sqrtPriceX96, reserve1 = L * sqrtPriceX96 / 2^96
                    // We keep calculations in BigInt to avoid precision loss
                    const Q96 = BigInt(2 ** 96)
                    const reserve0 =
                      sqrtPriceX96BigInt > 0n
                        ? (liquidity * Q96) / sqrtPriceX96BigInt
                        : liquidity
                    const reserve1 =
                      sqrtPriceX96BigInt > 0n
                        ? (liquidity * sqrtPriceX96BigInt) / Q96
                        : liquidity

                    // Create vertex
                    // IMPORTANT: Use the ordered tokens (token0, token1) not the query tokens (tokenA, tokenB)
                    // The reserves are calculated based on ordered tokens, so vertex must store ordered tokens
                    const vertex: Vertex = {
                      pair: `${tokenA}|||${tokenB}`,
                      poolAddress,
                      token0: token0, // Use ordered token0 (lower address)
                      token1: token1, // Use ordered token1 (higher address)
                      reserve0: reserve0 || liquidity, // Fallback to liquidity if reserve calc fails
                      reserve1: reserve1 || liquidity,
                      fee,
                      liquidity,
                      sqrtPriceX96,
                      tick,
                    }

                    // Add vertex to map (both directions)
                    vertices.set(`${tokenA}|||${tokenB}`, vertex)
                    vertices.set(`${tokenB}|||${tokenA}`, vertex)

                    // Add edges to graph
                    if (!tokenGraph.has(tokenA)) {
                      tokenGraph.set(tokenA, [])
                    }
                    if (!tokenGraph.has(tokenB)) {
                      tokenGraph.set(tokenB, [])
                    }

                    const tokenAEdges = tokenGraph.get(tokenA)!
                    const tokenBEdges = tokenGraph.get(tokenB)!

                    if (!tokenAEdges.includes(tokenB)) {
                      tokenAEdges.push(tokenB)
                    }
                    if (!tokenBEdges.includes(tokenA)) {
                      tokenBEdges.push(tokenA)
                    }
                  } catch {
                    // Pool doesn't exist or has issues - skip silently
                  }
                })(),
              )
            }
          }
        }

        // Wait for all pool queries to complete
        await Promise.all(poolQueries)

        return {
          vertices,
          tokenGraph,
        }
      } catch (error) {
        console.error('Error building pool graph:', error)
        return {
          vertices: new Map<string, Vertex>(),
          tokenGraph: new Map<string, string[]>(),
        }
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    throwOnError: false, // Don't throw errors to prevent app crash
  })
}
