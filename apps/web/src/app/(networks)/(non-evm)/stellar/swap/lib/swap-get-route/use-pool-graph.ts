import { useQuery } from '@tanstack/react-query'
import { staticTokens } from '~stellar/_common/lib/assets/token-assets'
import {
  getFactoryContractClient,
  getPoolContractClient,
} from '~stellar/_common/lib/soroban/client'
import { isAddressLower } from '~stellar/_common/lib/soroban/constants'
import { contractAddresses } from '~stellar/_common/lib/soroban/contracts'
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
      // Store arrays of vertices per token pair to handle multiple fee tiers
      const vertices = new Map<string, Vertex[]>()
      const tokenGraph = new Map<string, string[]>()

      try {
        // Get factory client to discover pools
        const factoryClient = getFactoryContractClient({
          contractId: contractAddresses.FACTORY,
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
        const knownTokens = staticTokens.map((token) => token.contract)

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
                    // Order tokens by decoded bytes (not string comparison - base32 doesn't preserve byte ordering)
                    const poolResult = await factoryClient.get_pool({
                      token_a: isAddressLower(tokenA, tokenB) ? tokenA : tokenB,
                      token_b: isAddressLower(tokenA, tokenB) ? tokenB : tokenA,
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

                    const [
                      slot0Result,
                      liquidityResult,
                      token0Result,
                      token1Result,
                    ] = await Promise.all([
                      poolClient.slot0(),
                      poolClient.liquidity(),
                      // Fetch canonical pool token order to avoid relying on string compare
                      // These functions exist on the pool contract
                      poolClient.token0(),
                      poolClient.token1(),
                    ])

                    const sqrtPriceX96 = slot0Result.result.sqrt_price_x96
                    const liquidity = BigInt(liquidityResult.result || 0)

                    // Skip uninitialized pools (sqrt_price_x96 = 0)
                    if (sqrtPriceX96 === 0n || sqrtPriceX96 === undefined) {
                      console.log(
                        `⚠️ Skipping uninitialized pool: ${poolAddress}`,
                      )
                      return
                    }

                    // Skip pools with zero liquidity
                    if (liquidity === 0n) {
                      console.log(
                        `⚠️ Skipping pool with zero liquidity: ${poolAddress}`,
                      )
                      return
                    }

                    // Get slot0 data
                    const slot0 = slot0Result.result

                    const tick = Number(slot0.tick || 0)

                    // Calculate approximate reserves from liquidity and sqrt price
                    // For V3/concentrated liquidity: reserve = liquidity / sqrt(price) and reserve1 = liquidity * sqrt(price)
                    // sqrtPrice = sqrtPriceX96 / 2^96
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

                    // Create vertex using canonical pool order
                    // IMPORTANT: Vertex must be internally consistent
                    // - pair field uses pool's token0/token1 order
                    // - reserves match this ordering (reserve0 for token0, reserve1 for token1)
                    const token0 = token0Result.result as string
                    const token1 = token1Result.result as string
                    const vertex: Vertex = {
                      pair: `${token0}|||${token1}`, // Must match token0/token1 ordering
                      poolAddress,
                      token0: token0, // Ordered: lower address
                      token1: token1, // Ordered: higher address
                      reserve0: reserve0 || liquidity, // Reserve for token0
                      reserve1: reserve1 || liquidity, // Reserve for token1
                      fee,
                      liquidity,
                      sqrtPriceX96,
                      tick,
                    }

                    // Add vertex to map (both directions)
                    // Store arrays to handle multiple pools (fee tiers) for same pair
                    const key1 = `${tokenA}|||${tokenB}`
                    const key2 = `${tokenB}|||${tokenA}`

                    if (!vertices.has(key1)) {
                      vertices.set(key1, [])
                    }
                    if (!vertices.has(key2)) {
                      vertices.set(key2, [])
                    }

                    vertices.get(key1)!.push(vertex)
                    vertices.get(key2)!.push(vertex)

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
          vertices: new Map<string, Vertex[]>(),
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
