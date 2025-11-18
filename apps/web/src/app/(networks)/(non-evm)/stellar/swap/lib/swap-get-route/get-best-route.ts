import type { Token } from '~stellar/_common/lib/types/token.type'
import { computeExactOutput } from './compute-exact-output'
import { computePriceImpact } from './compute-price-impact'
import type { Route, Vertex } from './types'

/**
 * Calculate a route score that balances output amount and price impact
 * Higher score = better route
 *
 * Formula: score = amountOut * (1 - priceImpact / 100)
 * This penalizes routes with high price impact while still prioritizing higher output
 */
function calculateRouteScore(route: Route): number {
  // Normalize amountOut to a 0-1 scale (using log scale to handle large numbers)
  // For comparison purposes, we use the relative difference
  const amountOutNum = Number(route.amountOut)
  const priceImpactPercent = route.priceImpact || 0

  // Score = output amount adjusted by price impact penalty
  // Price impact is a percentage, so we reduce the score proportionally
  const priceImpactMultiplier = 1 - Math.min(priceImpactPercent / 100, 0.5) // Cap penalty at 50%

  // Use log scale for amountOut to prevent very large numbers from dominating
  // Add 1 to avoid log(0) and normalize
  const normalizedAmount = Math.log10(amountOutNum + 1)

  return normalizedAmount * priceImpactMultiplier
}

interface GetBestRoute {
  amountIn: bigint
  vertices: Map<string, Vertex[]> // Changed to array to support multiple pools per pair
  tokenGraph: Map<string, string[]>
  tokenIn: Token
  tokenOut: Token
  maxHops?: number
}

/**
 * Find the best swap route using graph search
 * Similar to Aptos implementation but adapted for Stellar's concentrated liquidity
 */
export function getBestRoute({
  amountIn,
  vertices,
  tokenGraph,
  tokenIn,
  tokenOut,
  maxHops = 3, // Default to 3 hops max (4 tokens in path)
}: GetBestRoute): Route | null {
  try {
    // Validate inputs
    if (!tokenIn || !tokenOut || !vertices || !tokenGraph) {
      console.error('Invalid inputs to getBestRoute')
      return null
    }

    if (!tokenIn.contract || !tokenOut.contract) {
      console.error('Token contracts are required')
      return null
    }

    const bestRoute = findBestRoute({
      tokenIn: tokenIn.contract,
      tokenOut: tokenOut.contract,
      graph: tokenGraph,
      amountIn,
      vertices,
      maxDepth: maxHops + 1, // maxDepth is the number of tokens in the path
    })

    return bestRoute
  } catch (error) {
    console.error('Error in getBestRoute:', error)
    return null
  }
}

interface CalculateAmountOut {
  route: string[]
  amountIn: bigint
  vertices: Map<string, Vertex[]> // Changed to array to support multiple pools per pair
}

/**
 * Calculate the output amount for a given route
 * Iterates through each hop and calculates the cumulative output
 */
function calculateAmountOut({
  amountIn,
  route,
  vertices,
}: CalculateAmountOut): Route | null {
  try {
    if (route.length < 2) {
      return null
    }

    let currentAmount = amountIn
    const pools: string[] = []
    const fees: number[] = []
    const prices: number[] = []

    // Calculate output for each hop in the route
    for (let i = 0; i < route.length - 1; i++) {
      const tokenA = route[i]
      const tokenB = route[i + 1]

      if (!tokenA || !tokenB) {
        return null
      }

      // Try both directions for the pair
      const pairKey1 = `${tokenA}|||${tokenB}`
      const pairKey2 = `${tokenB}|||${tokenA}`

      // Get all vertices for this pair (may have multiple pools with different fees)
      const verticesForPair = vertices.get(pairKey1) || vertices.get(pairKey2)

      if (!verticesForPair || verticesForPair.length === 0) {
        // No pool exists for this pair
        return null
      }

      // Try all pools for this pair and pick the best one
      let bestVertex: Vertex | null = null
      let bestOutput = 0n
      let bestPriceImpact = Number.POSITIVE_INFINITY

      for (const vertex of verticesForPair) {
        // Determine which direction we're swapping
        const isForward = vertex.token0 === tokenA
        const reserve0 = isForward ? vertex.reserve0 : vertex.reserve1
        const reserve1 = isForward ? vertex.reserve1 : vertex.reserve0

        // Calculate output for this hop
        const output = computeExactOutput({
          amountIn: currentAmount,
          reserve0,
          reserve1,
          fee: vertex.fee,
        })

        if (output === 0n) {
          // Swap would fail (insufficient liquidity) - skip this pool
          continue
        }

        // Calculate price for this hop to estimate price impact
        const Q96 = 2 ** 96
        const sqrtPrice = Number(vertex.sqrtPriceX96) / Q96
        const poolPrice = sqrtPrice * sqrtPrice
        const midPrice = isForward ? poolPrice : 1 / poolPrice
        const hopPriceImpact = computePriceImpact({
          midPrice,
          amountIn: currentAmount,
          amountOut: output,
        })

        // Prefer pool with better output and lower price impact
        // Score = output * (1 - priceImpact/100)
        const score = Number(output) * (1 - hopPriceImpact / 100)
        const bestScore = Number(bestOutput) * (1 - bestPriceImpact / 100)

        if (!bestVertex || score > bestScore) {
          bestVertex = vertex
          bestOutput = output
          bestPriceImpact = hopPriceImpact
        }
      }

      if (!bestVertex) {
        // No valid pool found for this pair
        return null
      }

      // Use the best vertex for this hop
      const isForward = bestVertex.token0 === tokenA

      // Store pool and fee info
      pools.push(bestVertex.poolAddress)
      fees.push(bestVertex.fee)

      // Calculate mid price from sqrtPriceX96 for concentrated liquidity pools
      // sqrtPrice = sqrt(token1/token0), so price = (sqrtPrice)^2
      const Q96 = 2 ** 96
      const sqrtPrice = Number(bestVertex.sqrtPriceX96) / Q96
      const poolPrice = sqrtPrice * sqrtPrice // token1 per token0

      // Adjust price based on swap direction
      const midPrice = isForward ? poolPrice : 1 / poolPrice
      prices.push(midPrice)

      // Use best output as input for next hop
      currentAmount = bestOutput
    }

    // Calculate overall mid price (product of all hop prices)
    const overallMidPrice = prices.reduce((acc, price) => acc * price, 1)

    // Calculate price impact
    const priceImpact = computePriceImpact({
      midPrice: overallMidPrice,
      amountIn,
      amountOut: currentAmount,
    })

    return {
      route: [...route],
      pools,
      fees,
      amountOut: currentAmount,
      priceImpact,
    }
  } catch (error) {
    console.error('Error in calculateAmountOut:', error)
    return null
  }
}

interface FindBestRoute {
  tokenIn: string
  tokenOut: string
  graph: Map<string, string[]>
  visited?: Record<string, boolean>
  currentRoute?: string[]
  amountIn: bigint
  vertices: Map<string, Vertex[]> // Changed to array to support multiple pools per pair
  bestRoute?: { current: Route | null }
  maxDepth?: number
}

/**
 * Recursive DFS to find all possible routes and return the best one
 * A route is better if it yields more output tokens
 */
function findBestRoute({
  tokenIn,
  tokenOut,
  graph,
  visited = {},
  currentRoute = [],
  amountIn,
  vertices,
  bestRoute = { current: null },
  maxDepth = 4,
}: FindBestRoute): Route | null {
  try {
    // Depth limit check (prevent infinite loops and excessive computation)
    if (currentRoute.length >= maxDepth) {
      return bestRoute.current
    }

    if (!tokenIn || !tokenOut) {
      return bestRoute.current
    }

    // Mark current token as visited
    visited[tokenIn] = true

    // Add current token to route
    currentRoute.push(tokenIn)

    // Check if we've reached the destination
    if (tokenIn === tokenOut) {
      // Calculate output for this route
      const route = calculateAmountOut({
        amountIn,
        route: currentRoute,
        vertices,
      })

      // Update best route if this one is better
      // Consider both amountOut and priceImpact for better routing decisions
      if (route) {
        if (!bestRoute.current) {
          bestRoute.current = route
        } else {
          // Use a scoring function that considers both output amount and price impact
          const currentScore = calculateRouteScore(bestRoute.current)
          const newScore = calculateRouteScore(route)

          // Prefer route with higher score (better output with lower price impact)
          if (newScore > currentScore) {
            bestRoute.current = route
          } else if (newScore === currentScore) {
            // If scores are equal, prefer the one with higher output
            if (route.amountOut > bestRoute.current.amountOut) {
              bestRoute.current = route
            }
          }
        }
      }
    } else {
      // Explore adjacent tokens
      const adjacentTokens = graph.get(tokenIn)

      if (adjacentTokens && Array.isArray(adjacentTokens)) {
        for (const adjacentToken of adjacentTokens) {
          // Only visit unvisited tokens
          if (adjacentToken && !visited[adjacentToken]) {
            findBestRoute({
              tokenIn: adjacentToken,
              tokenOut,
              graph,
              visited: { ...visited }, // Copy visited to allow backtracking
              currentRoute: [...currentRoute], // Copy route to allow backtracking
              amountIn,
              vertices,
              bestRoute,
              maxDepth,
            })
          }
        }
      }
    }

    // Backtrack: remove current token from route and mark as unvisited
    currentRoute.pop()
    visited[tokenIn] = false

    return bestRoute.current
  } catch (error) {
    console.error('Error in findBestRoute:', error)
    return bestRoute.current
  }
}
