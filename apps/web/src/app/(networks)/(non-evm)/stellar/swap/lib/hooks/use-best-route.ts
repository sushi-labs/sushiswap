import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { QuoteService } from '~stellar/_common/lib/services/quote-service'
import { getTokenByContract } from '~stellar/_common/lib/soroban/token-helpers'
import type { Token } from '~stellar/_common/lib/types/token.type'
import type { RouteWithTokens, Vertex } from '../swap-get-route'
import { usePoolGraph } from '../swap-get-route'

interface UseBestRouteParams {
  tokenIn: Token | null
  tokenOut: Token | null
  amountIn: bigint
  enabled?: boolean
}

interface CandidateRoute {
  path: string[]
  fees: number[]
  pools: string[]
  vertices: Vertex[]
}

/**
 * Find all candidate routes between two tokens using the pool graph
 */
function findCandidateRoutes(
  tokenIn: string,
  tokenOut: string,
  tokenGraph: Map<string, string[]>,
  vertices: Map<string, Vertex[]>,
  maxHops = 3,
): CandidateRoute[] {
  const routes: CandidateRoute[] = []

  // DFS to find all paths
  function dfs(
    current: string,
    target: string,
    visited: Set<string>,
    path: string[],
    poolPath: string[],
    feePath: number[],
    vertexPath: Vertex[],
    depth: number,
  ) {
    if (depth > maxHops) return
    if (current === target && path.length >= 2) {
      routes.push({
        path: [...path],
        fees: [...feePath],
        pools: [...poolPath],
        vertices: [...vertexPath],
      })
      return
    }

    const neighbors = tokenGraph.get(current) || []
    for (const neighbor of neighbors) {
      if (visited.has(neighbor) && neighbor !== target) continue

      // Get all vertices (pools) between current and neighbor
      const pairKey1 = `${current}|||${neighbor}`
      const pairKey2 = `${neighbor}|||${current}`
      const pairVertices =
        vertices.get(pairKey1) || vertices.get(pairKey2) || []

      // Try each pool (different fee tiers) for this pair
      for (const vertex of pairVertices) {
        visited.add(neighbor)
        path.push(neighbor)
        poolPath.push(vertex.poolAddress)
        feePath.push(vertex.fee)
        vertexPath.push(vertex)

        dfs(
          neighbor,
          target,
          visited,
          path,
          poolPath,
          feePath,
          vertexPath,
          depth + 1,
        )

        path.pop()
        poolPath.pop()
        feePath.pop()
        vertexPath.pop()
        visited.delete(neighbor)
      }
    }
  }

  const visited = new Set<string>([tokenIn])
  dfs(tokenIn, tokenOut, visited, [tokenIn], [], [], [], 0)

  return routes
}

/**
 * Calculate price impact from pool state and quote result
 */
function calculatePriceImpact(
  amountIn: bigint,
  amountOut: bigint,
  vertices: Vertex[],
  path: string[],
): number {
  if (vertices.length === 0 || amountIn === 0n || amountOut === 0n) {
    return 0
  }

  try {
    // Calculate the mid price from pool state
    // For multi-hop, multiply the mid prices of each hop
    let overallMidPrice = 1

    for (let i = 0; i < vertices.length; i++) {
      const vertex = vertices[i]
      const tokenA = path[i]

      // Determine swap direction
      const isForward = vertex.token0 === tokenA

      // Calculate mid price from sqrtPriceX96
      // sqrtPrice = sqrtPriceX96 / 2^96
      // price (token1/token0) = sqrtPrice^2
      const Q96 = 2 ** 96
      const sqrtPrice = Number(vertex.sqrtPriceX96) / Q96
      const poolPrice = sqrtPrice * sqrtPrice

      // Adjust for swap direction
      const midPrice = isForward ? poolPrice : 1 / poolPrice
      overallMidPrice *= midPrice
    }

    // Calculate expected output at mid price
    const expectedOutput = Number(amountIn) * overallMidPrice

    if (expectedOutput === 0) return 0

    // Price impact = (expected - actual) / expected * 100
    const priceImpact =
      ((expectedOutput - Number(amountOut)) / expectedOutput) * 100

    return Math.abs(priceImpact)
  } catch (error) {
    console.error('Error calculating price impact:', error)
    return 0
  }
}

export async function getBestRoute({
  tokenIn,
  tokenOut,
  amountIn,
  poolGraphData,
}: {
  tokenIn: Token
  tokenOut: Token
  amountIn: bigint
  poolGraphData: {
    vertices: Map<string, Vertex[]>
    tokenGraph: Map<string, string[]>
  }
}): Promise<RouteWithTokens | null> {
  try {
    const { vertices, tokenGraph } = poolGraphData

    // Check if tokens exist in the graph
    if (
      !tokenGraph.has(tokenIn.contract) &&
      !tokenGraph.has(tokenOut.contract)
    ) {
      return null
    }

    // Find all candidate routes
    const candidateRoutes = findCandidateRoutes(
      tokenIn.contract,
      tokenOut.contract,
      tokenGraph,
      vertices,
      3, // max 3 hops
    )

    if (candidateRoutes.length === 0) {
      return null
    }

    // Get on-chain quotes for each route
    const quoteService = new QuoteService()
    const quotedRoutes: Array<{
      route: CandidateRoute
      amountOut: bigint
      priceImpact: number
    }> = []

    // Query all routes in parallel
    const quotePromises = candidateRoutes.map(async (route) => {
      try {
        let quote

        if (route.path.length === 2) {
          // Direct swap - use single-hop quote
          quote = await quoteService.getQuoteExactInputSingle({
            tokenIn: route.path[0],
            tokenOut: route.path[1],
            fee: route.fees[0],
            amountIn,
          })
        } else {
          // Multi-hop swap
          quote = await quoteService.getQuoteExactInput({
            path: route.path,
            fees: route.fees,
            amountIn,
          })
        }

        if (quote && quote.amountOut > 0n) {
          // Calculate price impact from pool state
          const priceImpact = calculatePriceImpact(
            amountIn,
            quote.amountOut,
            route.vertices,
            route.path,
          )

          return {
            route,
            amountOut: quote.amountOut,
            priceImpact,
          }
        }
      } catch (error) {
        console.warn(`Quote failed for route ${route.path.join(' → ')}:`, error)
      }
      return null
    })

    const results = await Promise.all(quotePromises)

    // Filter successful quotes
    for (const result of results) {
      if (result) {
        quotedRoutes.push(result)
      }
    }

    if (quotedRoutes.length === 0) {
      return null
    }

    // Select best route: highest output with reasonable price impact
    // Score = amountOut * (1 - priceImpact/100)
    quotedRoutes.sort((a, b) => {
      const scoreA =
        Number(a.amountOut) * (1 - Math.min(a.priceImpact / 100, 0.5))
      const scoreB =
        Number(b.amountOut) * (1 - Math.min(b.priceImpact / 100, 0.5))
      return scoreB - scoreA
    })

    const bestQuotedRoute = quotedRoutes[0]

    // Convert route addresses to Token objects
    const tokenPromises: Promise<Token | null>[] =
      bestQuotedRoute.route.path.map(async (address) => {
        try {
          return await getTokenByContract(address)
        } catch (error) {
          console.error(`Error getting token by contract ${address}:`, error)
          return null
        }
      })

    const tokens = (await Promise.all(tokenPromises)).filter(
      (token): token is Token => token !== null,
    )

    if (tokens.length !== bestQuotedRoute.route.path.length) {
      console.error('Failed to resolve all tokens in route')
      return null
    }

    return {
      route: bestQuotedRoute.route.path,
      pools: bestQuotedRoute.route.pools,
      fees: bestQuotedRoute.route.fees,
      amountOut: bestQuotedRoute.amountOut,
      priceImpact: bestQuotedRoute.priceImpact,
      tokens,
    }
  } catch (error) {
    console.error('Error finding best route:', error)
    return null
  }
}

/**
 * Hook to find the best swap route using on-chain quotes
 *
 * This hook:
 * 1. Builds a graph of available pools
 * 2. Finds all candidate routes (direct and multi-hop)
 * 3. Gets on-chain quotes for each route via QuoteService
 * 4. Returns the route with the best output
 */
export function useBestRoute({
  tokenIn,
  tokenOut,
  amountIn,
}: UseBestRouteParams) {
  // Build additional tokens list from swap input/output
  // This ensures the pool graph includes routes for the selected tokens
  const additionalTokens = [tokenIn?.contract, tokenOut?.contract].filter(
    (t): t is string => !!t,
  )

  // Get the pool graph, augmented with input/output tokens
  const { data: poolGraphData, isPending: isPendingGraph } = usePoolGraph({
    additionalTokens,
  })

  // Find the best route using on-chain quotes
  const routeQuery = useQuery({
    queryKey: [
      'stellar',
      'best-route-onchain',
      tokenIn?.contract,
      tokenOut?.contract,
      amountIn.toString(),
    ],
    queryFn: async (): Promise<RouteWithTokens | null> => {
      if (!tokenIn || !tokenOut || !poolGraphData || amountIn === 0n) {
        return null
      }

      return await getBestRoute({
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        amountIn,
        poolGraphData: poolGraphData,
      })
    },
    enabled: Boolean(
      tokenIn &&
        tokenOut &&
        poolGraphData &&
        amountIn > 0n &&
        tokenIn.contract !== tokenOut.contract,
    ),
    staleTime: ms('10s'),
    gcTime: ms('30s'),
    retry: 1, // Retry once on failure
    throwOnError: false,
  })

  return {
    route: routeQuery.data,
    isPending: isPendingGraph || routeQuery.isPending,
    isFetching: routeQuery.isFetching,
    isError: routeQuery.isError,
    error: routeQuery.error,
  }
}
