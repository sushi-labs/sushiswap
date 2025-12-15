import { useQuery } from '@tanstack/react-query'
import { staticTokens } from '~stellar/_common/lib/assets/token-assets'
import { getFees } from '~stellar/_common/lib/soroban'
import {
  getFactoryContractClient,
  getPoolLensContractClient,
} from '~stellar/_common/lib/soroban/client'
import { isAddressLower } from '~stellar/_common/lib/soroban/constants'
import { contractAddresses } from '~stellar/_common/lib/soroban/contracts'
import type { Vertex } from './types'

type GetPoolsByTokenPairsBatchedParams = Array<{
  token_a: string
  token_b: string
  fee: number
}>

type PoolData = {
  token0: string
  token1: string
  tick: number
  sqrtPriceX96: bigint
  liquidity: bigint
  poolAddress: string
  fee: number
}

const getPoolsByTokenPairsBatched = async (
  params: GetPoolsByTokenPairsBatchedParams,
): Promise<PoolData[]> => {
  const BATCH_SIZE = 3
  const batches: GetPoolsByTokenPairsBatchedParams[] = []
  const poolLensContractClient = getPoolLensContractClient({
    contractId: contractAddresses.POOL_LENS,
  })

  for (let i = 0; i < params.length; i += BATCH_SIZE) {
    batches.push(params.slice(i, i + BATCH_SIZE))
  }

  const results: PoolData[][] = await Promise.all(
    batches.map(async (batch) => {
      const batchPoolsResult = await poolLensContractClient.get_pools_by_pairs({
        pairs: batch,
      })
      const batchedPoolsInfo: PoolData[] = []
      for (const poolResult of batchPoolsResult.result) {
        if (poolResult.result.tag === 'NotFound') {
          continue
        }
        const [poolData] = poolResult.result.values
        batchedPoolsInfo.push({
          token0: poolData.token0,
          token1: poolData.token1,
          tick: poolData.tick,
          sqrtPriceX96: poolData.sqrt_price_x96,
          liquidity: poolData.liquidity,
          poolAddress: poolResult.pool,
          fee: poolData.fee,
        })
      }
      return batchedPoolsInfo
    }),
  )

  return results.flat()
}

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

        const feeTiers = await getFees()

        // Query all possible pool combinations
        const poolQueryInputs: GetPoolsByTokenPairsBatchedParams = []

        for (let i = 0; i < knownTokens.length; i++) {
          for (let j = i + 1; j < knownTokens.length; j++) {
            const tokenA = knownTokens[i]
            const tokenB = knownTokens[j]
            for (const fee of feeTiers) {
              poolQueryInputs.push({
                token_a: isAddressLower(tokenA, tokenB) ? tokenA : tokenB,
                token_b: isAddressLower(tokenA, tokenB) ? tokenB : tokenA,
                fee,
              })
            }
          }
        }

        const pools = await getPoolsByTokenPairsBatched(poolQueryInputs)

        for (const pool of pools) {
          try {
            // Skip uninitialized pools (sqrt_price_x96 = 0)
            if (pool.sqrtPriceX96 === 0n) {
              console.log(`⚠️ Skipping uninitialized pool: ${pool.poolAddress}`)
              continue
            }

            // Skip pools with zero liquidity
            if (pool.liquidity === 0n) {
              console.log(
                `⚠️ Skipping pool with zero liquidity: ${pool.poolAddress}`,
              )
              continue
            }

            // Calculate approximate reserves from liquidity and sqrt price
            // For V3/concentrated liquidity: reserve = liquidity / sqrt(price) and reserve1 = liquidity * sqrt(price)
            // sqrtPrice = sqrtPriceX96 / 2^96

            // Virtual reserves for this liquidity position
            // reserve0 = L * 2^96 / sqrtPriceX96, reserve1 = L * sqrtPriceX96 / 2^96
            // We keep calculations in BigInt to avoid precision loss
            const Q96 = BigInt(2 ** 96)
            const reserve0 =
              pool.sqrtPriceX96 > 0n
                ? (pool.liquidity * Q96) / pool.sqrtPriceX96
                : pool.liquidity
            const reserve1 =
              pool.sqrtPriceX96 > 0n
                ? (pool.liquidity * pool.sqrtPriceX96) / Q96
                : pool.liquidity

            // Create vertex using canonical pool order
            // IMPORTANT: Vertex must be internally consistent
            // - pair field uses pool's token0/token1 order
            // - reserves match this ordering (reserve0 for token0, reserve1 for token1)
            const vertex: Vertex = {
              pair: `${pool.token0}|||${pool.token1}`, // Must match token0/token1 ordering
              poolAddress: pool.poolAddress,
              token0: pool.token0, // Ordered: lower address
              token1: pool.token1, // Ordered: higher address
              reserve0: reserve0 || pool.liquidity, // Reserve for token0
              reserve1: reserve1 || pool.liquidity, // Reserve for token1
              fee: pool.fee,
              liquidity: pool.liquidity,
              sqrtPriceX96: pool.sqrtPriceX96,
              tick: pool.tick,
            }

            // Add vertex to map (both directions)
            // Store arrays to handle multiple pools (fee tiers) for same pair
            const key1 = `${pool.token0}|||${pool.token1}`
            const key2 = `${pool.token1}|||${pool.token0}`

            if (!vertices.has(key1)) {
              vertices.set(key1, [])
            }
            if (!vertices.has(key2)) {
              vertices.set(key2, [])
            }

            vertices.get(key1)!.push(vertex)
            vertices.get(key2)!.push(vertex)

            // Add edges to graph
            if (!tokenGraph.has(pool.token0)) {
              tokenGraph.set(pool.token0, [])
            }
            if (!tokenGraph.has(pool.token1)) {
              tokenGraph.set(pool.token1, [])
            }

            const tokenAEdges = tokenGraph.get(pool.token0)!
            const tokenBEdges = tokenGraph.get(pool.token1)!

            if (!tokenAEdges.includes(pool.token1)) {
              tokenAEdges.push(pool.token1)
            }
            if (!tokenBEdges.includes(pool.token0)) {
              tokenBEdges.push(pool.token0)
            }
          } catch {
            // Pool doesn't exist or has issues - skip silently
          }
        }

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
    retry: 3, // Retry up to 3 times on RPC failures
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
    throwOnError: false, // Don't throw errors to prevent app crash
  })
}
