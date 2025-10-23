import type { Token } from '~stellar/_common/lib/types/token.type'
import { computeExactOutput } from './compute-exact-output'
import { computePriceImpact } from './compute-price-impact'
import type { Route, Vertex } from './types'

interface GetBestRoute {
  amountIn: bigint
  vertices: Map<string, Vertex>
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
  const bestRoute = findBestRoute({
    tokenIn: tokenIn.contract,
    tokenOut: tokenOut.contract,
    graph: tokenGraph,
    amountIn,
    vertices,
    maxDepth: maxHops + 1, // maxDepth is the number of tokens in the path
  })

  return bestRoute
}

interface CalculateAmountOut {
  route: string[]
  amountIn: bigint
  vertices: Map<string, Vertex>
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

    // Try both directions for the pair
    const pairKey1 = `${tokenA}|||${tokenB}`
    const pairKey2 = `${tokenB}|||${tokenA}`

    const vertex = vertices.get(pairKey1) || vertices.get(pairKey2)

    if (!vertex) {
      // No pool exists for this pair
      return null
    }

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
      // Swap would fail (insufficient liquidity)
      return null
    }

    // Store pool and fee info
    pools.push(vertex.poolAddress)
    fees.push(vertex.fee)

    // Store mid price for this hop (reserve1 / reserve0)
    const midPrice = Number(reserve1) / Number(reserve0)
    prices.push(midPrice)

    // Use output as input for next hop
    currentAmount = output
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
}

interface FindBestRoute {
  tokenIn: string
  tokenOut: string
  graph: Map<string, string[]>
  visited?: Record<string, boolean>
  currentRoute?: string[]
  amountIn: bigint
  vertices: Map<string, Vertex>
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
  // Depth limit check (prevent infinite loops and excessive computation)
  if (currentRoute.length >= maxDepth) {
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
    if (route) {
      if (!bestRoute.current) {
        bestRoute.current = route
      } else if (route.amountOut > bestRoute.current.amountOut) {
        bestRoute.current = route
      }
    }
  } else {
    // Explore adjacent tokens
    const adjacentTokens = graph.get(tokenIn)

    if (adjacentTokens) {
      for (const adjacentToken of adjacentTokens) {
        // Only visit unvisited tokens
        if (!visited[adjacentToken]) {
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
}
