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
      console.log('🔄 Building pool graph...')

      const vertices = new Map<string, Vertex>()
      const tokenGraph = new Map<string, string[]>()

      try {
        // Get factory client to discover pools
        const factoryClient = getFactoryContractClient({
          contractId: CONTRACT_ADDRESSES.FACTORY,
        })

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
                    // Query pool address from factory
                    const poolResult = await factoryClient.get_pool({
                      token_a: tokenA,
                      token_b: tokenB,
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

                    const liquidity = BigInt(liquidityResult.result || 0)

                    // Skip pools with no liquidity
                    if (liquidity === 0n) {
                      return
                    }

                    // Get slot0 data
                    const slot0 = slot0Result.result
                    let sqrtPriceX96: bigint

                    // Handle field name confusion (same as in position-manager-helpers)
                    if (
                      slot0.sqrt_price_x96 &&
                      Number(slot0.sqrt_price_x96) !== 0
                    ) {
                      sqrtPriceX96 = BigInt(slot0.sqrt_price_x96)
                    } else if (
                      slot0.fee_protocol &&
                      BigInt(slot0.fee_protocol) !== 0n
                    ) {
                      sqrtPriceX96 = BigInt(slot0.fee_protocol)
                    } else {
                      // No valid price data
                      return
                    }

                    const tick = Number(slot0.tick || 0)

                    // Calculate approximate reserves from liquidity and price
                    // This is a simplification - actual V3 reserves depend on tick ranges
                    // For routing purposes, we estimate based on current price
                    const priceNum = Number(sqrtPriceX96) / 2 ** 96
                    const priceScaled = BigInt(Math.floor(priceNum * 1000000))
                    const reserve0 =
                      priceScaled > 0n ? liquidity / priceScaled : liquidity
                    const reserve1 =
                      priceScaled > 0n
                        ? (liquidity * priceScaled) / BigInt(1000000)
                        : liquidity

                    // Create vertex
                    const vertex: Vertex = {
                      pair: `${tokenA}|||${tokenB}`,
                      poolAddress,
                      token0: tokenA,
                      token1: tokenB,
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

                    console.log(
                      `✅ Added pool: ${getTokenByContract(tokenA)?.code}/${getTokenByContract(tokenB)?.code} (${fee / 10000}%)`,
                    )
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

        console.log(
          `✅ Pool graph built: ${vertices.size / 2} pools, ${tokenGraph.size} tokens`,
        )

        return {
          vertices,
          tokenGraph,
        }
      } catch (error) {
        console.error('❌ Failed to build pool graph:', error)
        return {
          vertices: new Map<string, Vertex>(),
          tokenGraph: new Map<string, string[]>(),
        }
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  })
}
