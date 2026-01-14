import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useMemo } from 'react'
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

interface PoolGraphData {
  vertices: Map<string, Vertex[]>
  tokenGraph: Map<string, string[]>
}

interface UsePoolGraphParams {
  /** Additional token addresses to include in the graph (e.g., swap input/output tokens) */
  additionalTokens?: string[]
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

const convertPoolDataToVertex = (pools: PoolData[]): Vertex[] => {
  const vertices = pools.map((pool) => {
    // Skip uninitialized pools (sqrt_price_x96 = 0)
    if (pool.sqrtPriceX96 === 0n) {
      return null
    }

    // Skip pools with zero liquidity
    if (pool.liquidity === 0n) {
      return null
    }

    // Calculate approximate reserves from liquidity and sqrt price
    // For V3/concentrated liquidity: reserve = liquidity / sqrt(price) and reserve1 = liquidity * sqrt(price)
    // sqrtPrice = sqrtPriceX96 / 2^96

    // Virtual reserves for this liquidity position
    // reserve0 = L * 2^96 / sqrtPriceX96, reserve1 = L * sqrtPriceX96 / 2^96
    // We keep calculations in BigInt to avoid precision loss
    const Q96 = 1n << 96n
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
    return vertex
  })
  return vertices.filter((v): v is Vertex => v !== null)
}

/**
 * Add a vertex to the graph data structures
 */
function addVertexToGraph(
  vertex: Vertex,
  tokenA: string,
  tokenB: string,
  vertices: Map<string, Vertex[]>,
  tokenGraph: Map<string, string[]>,
) {
  // Add vertex to map (both directions)
  const key1 = `${tokenA}|||${tokenB}`
  const key2 = `${tokenB}|||${tokenA}`

  if (!vertices.has(key1)) vertices.set(key1, [])
  if (!vertices.has(key2)) vertices.set(key2, [])

  // Avoid duplicates
  const existing = new Set(
    [...vertices.get(key1)!, ...vertices.get(key2)!].map((v) => v.poolAddress),
  )
  if (!existing.has(vertex.poolAddress)) {
    vertices.get(key1)!.push(vertex)
    vertices.get(key2)!.push(vertex)
  }

  // Add edges to graph
  if (!tokenGraph.has(tokenA)) tokenGraph.set(tokenA, [])
  if (!tokenGraph.has(tokenB)) tokenGraph.set(tokenB, [])

  const tokenAEdges = tokenGraph.get(tokenA)!
  const tokenBEdges = tokenGraph.get(tokenB)!

  if (!tokenAEdges.includes(tokenB)) tokenAEdges.push(tokenB)
  if (!tokenBEdges.includes(tokenA)) tokenBEdges.push(tokenA)
}

/**
 * Hook to get the base pool graph of hard-coded static tokens (cached, long-lived)
 */
function useBasePoolGraph() {
  // For performance, we'll query a subset of known token pairs
  // In production, you'd want to:
  // 1. Query all pools from the factory
  // 2. Cache results
  // 3. Only query active/liquid pools
  const baseTokenSymbols = ['XLM', 'USDC', 'EURC', 'PYUSD']
  const baseTokens = staticTokens.filter((token) =>
    baseTokenSymbols.includes(token.code),
  )
  const baseTokenAddresses = baseTokens.map((token) => token.contract)

  return useQuery<PoolGraphData>({
    queryKey: [
      'stellar',
      'base-pool-graph',
      [...baseTokenAddresses].sort().join(','),
    ],
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

        const feeTiers = getFees()

        // Query all possible pool combinations
        const poolQueryInputs: GetPoolsByTokenPairsBatchedParams = []

        for (let i = 0; i < baseTokenAddresses.length; i++) {
          for (let j = i + 1; j < baseTokenAddresses.length; j++) {
            const tokenA = baseTokenAddresses[i]
            const tokenB = baseTokenAddresses[j]
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
        const newVertices = convertPoolDataToVertex(pools)

        for (const vertex of newVertices) {
          addVertexToGraph(
            vertex,
            vertex.token0,
            vertex.token1,
            vertices,
            tokenGraph,
          )
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
    staleTime: ms('5m'),
    gcTime: ms('10m'),
    retry: 3, // Retry up to 3 times on RPC failures
    retryDelay: (attemptIndex) =>
      Math.min(ms('1s') * 2 ** attemptIndex, ms('10s')), // Exponential backoff
    throwOnError: false, // Don't throw errors to prevent app crash
  })
}

/**
 * Augment an existing pool graph with additional tokens (O(n) operation)
 * Only queries pools between additional tokens and existing tokens
 */
async function augmentPoolGraph({
  baseGraph,
  additionalTokens,
}: {
  baseGraph: PoolGraphData
  additionalTokens: string[]
}): Promise<PoolGraphData> {
  // Filter out additional tokens that are already in the base graph
  const baseTokens = Array.from(baseGraph.tokenGraph.keys())
  const newTokens = additionalTokens.filter(
    (token) => token && !baseTokens.includes(token),
  )
  if (newTokens.length === 0) {
    return baseGraph
  }

  // Clone the base graph to avoid mutation
  const vertices = new Map(baseGraph.vertices)
  const tokenGraph = new Map(baseGraph.tokenGraph)
  // Deep clone the arrays
  for (const [key, value] of vertices) {
    vertices.set(key, [...value])
  }
  for (const [key, value] of tokenGraph) {
    tokenGraph.set(key, [...value])
  }

  const factoryClient = getFactoryContractClient({
    contractId: contractAddresses.FACTORY,
  })

  if (!factoryClient) {
    return { vertices, tokenGraph }
  }

  const feeTiers = getFees()
  const poolQueryInputs: GetPoolsByTokenPairsBatchedParams = []

  // Only query pools between new tokens and ALL existing tokens (O(n) per new token)
  for (const newToken of newTokens) {
    for (const existingToken of baseTokens) {
      for (const fee of feeTiers) {
        poolQueryInputs.push({
          token_a: isAddressLower(newToken, existingToken)
            ? newToken
            : existingToken,
          token_b: isAddressLower(newToken, existingToken)
            ? existingToken
            : newToken,
          fee,
        })
      }
    }
  }

  // Also check pools between new tokens themselves
  for (let i = 0; i < newTokens.length; i++) {
    for (let j = i + 1; j < newTokens.length; j++) {
      for (const fee of feeTiers) {
        poolQueryInputs.push({
          token_a: isAddressLower(newTokens[i], newTokens[j])
            ? newTokens[i]
            : newTokens[j],
          token_b: isAddressLower(newTokens[i], newTokens[j])
            ? newTokens[j]
            : newTokens[i],
          fee,
        })
      }
    }
  }

  const poolsBetweenNewAndExistingTokens =
    await getPoolsByTokenPairsBatched(poolQueryInputs)

  const newVertices = convertPoolDataToVertex(poolsBetweenNewAndExistingTokens)

  for (const vertex of newVertices) {
    addVertexToGraph(vertex, vertex.token0, vertex.token1, vertices, tokenGraph)
  }

  return { vertices, tokenGraph }
}

/**
 * Build a graph of available pools for routing
 *
 * Optimized to:
 * 1. Cache a base graph with all common tokens (long-lived, O(n²) but cached)
 * 2. Augment with additional tokens on-demand (O(n) per additional token)
 *
 * Returns:
 * - vertices: Map of pool vertices (tokenA|||tokenB -> pool data)
 * - tokenGraph: Map of token adjacency list (token -> connected tokens)
 */
export function usePoolGraph({
  additionalTokens = [],
}: UsePoolGraphParams = {}) {
  const {
    data: baseGraph,
    isPending: isPendingBase,
    isError: isErrorBase,
    error: baseGraphError,
  } = useBasePoolGraph()

  // Filter additional tokens to only those not already in base
  const newTokens = useMemo(() => {
    if (!baseGraph) {
      return additionalTokens
    }
    return additionalTokens.filter(
      (token) =>
        token &&
        token.length > 0 &&
        !Array.from(baseGraph.tokenGraph.keys()).includes(token),
    )
  }, [baseGraph, additionalTokens])

  // Augment the base graph with additional tokens (only if needed)
  const augmentedQuery = useQuery({
    queryKey: [
      'stellar',
      'augmented-pool-graph',
      [...newTokens].sort().join(','),
    ],
    queryFn: async () => {
      if (!baseGraph) {
        return {
          vertices: new Map<string, Vertex[]>(),
          tokenGraph: new Map<string, string[]>(),
        }
      }

      if (newTokens.length === 0) {
        return baseGraph
      }

      return augmentPoolGraph({ baseGraph, additionalTokens: newTokens })
    },
    enabled: Boolean(baseGraph),
    staleTime: ms('2m'),
    gcTime: ms('5m'),
    retry: 1,
    throwOnError: false,
  })

  // Return base graph if no additional tokens, otherwise return augmented
  const data = newTokens.length === 0 ? baseGraph : augmentedQuery.data
  const isPending =
    isPendingBase || (newTokens.length > 0 && augmentedQuery.isPending)

  return {
    data,
    isPending,
    isError: augmentedQuery.isError || isErrorBase,
    error: augmentedQuery.error ?? baseGraphError,
  }
}
