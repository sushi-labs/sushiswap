import type { Token } from '~aptos/_common/lib/types/token'
import { computeExactOutput } from '../compute-exact-output'
import { computePriceImpact } from '../compute-price-impact'
import type { Route, Vertex } from '../types'

interface GetBestRoute {
  amountIn: number
  vertices: Map<string, Vertex>
  tokenGraph: Map<string, string[]>
  tokenIn: Token
  tokenOut: Token
}

export function getBestRoute({
  amountIn,
  vertices,
  tokenGraph,
  tokenIn,
  tokenOut,
}: GetBestRoute): Route | null {
  const bestRoute = findBestRoute({
    tokenIn: tokenIn.address,
    tokenOut: tokenOut.address,
    graph: tokenGraph,
    amountIn,
    vertices,
    maxDepth: 5, // The router doesn't support more than 4 hops
  })

  return bestRoute
}

interface CalculateAmountOut {
  route: string[]
  amountIn: number
  vertices: Map<string, Vertex>
}

function calculateAmountOut({
  amountIn,
  route,
  vertices,
}: CalculateAmountOut): Route | null {
  if (route.length < 2) {
    return null
  }

  let currentAmount = amountIn
  const prices: number[] = []

  // Process each hop in the route
  for (let i = 0; i < route.length - 1; i++) {
    const tokenA = route[i]
    const tokenB = route[i + 1]

    // Try both directions for the pair
    const pairKey1 = `${tokenA}|||${tokenB}`
    const pairKey2 = `${tokenB}|||${tokenA}`

    let vertex: Vertex | undefined
    let isReversed = false

    if (vertices.has(pairKey1)) {
      vertex = vertices.get(pairKey1)!
      isReversed = false
    } else if (vertices.has(pairKey2)) {
      vertex = vertices.get(pairKey2)!
      isReversed = true
    } else {
      // No liquidity pair found for this hop
      return null
    }

    if (!vertex) {
      return null
    }

    const res_x = isReversed ? vertex.res_y : vertex.res_x
    const res_y = isReversed ? vertex.res_x : vertex.res_y

    // Calculate output for this hop
    currentAmount = computeExactOutput({
      amountIn: currentAmount,
      res_x,
      res_y,
    })

    // Store price for this hop
    prices.push(res_y / res_x)
  }

  // Calculate mid price (geometric mean of all hop prices)
  const midPrice =
    prices.reduce(
      (accumulator, currentValue) => accumulator * currentValue,
      1,
    ) **
    (1 / prices.length)

  const priceImpact = computePriceImpact({
    midPrice,
    amountIn,
    amountOut: currentAmount,
  })

  return {
    route: [...route],
    amountOut: currentAmount,
    priceImpact: priceImpact,
  }
}

interface FindPossibleRoutes {
  tokenIn: string
  tokenOut: string
  graph: Map<string, string[]>
  amountIn: number
  vertices: Map<string, Vertex>
  maxDepth?: number
}

function findBestRoute({
  tokenIn,
  tokenOut,
  graph,
  amountIn,
  vertices,
  maxDepth = 5,
}: FindPossibleRoutes): Route | null {
  let currentBestRoute: Route | null = null

  function dfs(
    currentToken: string,
    targetToken: string,
    visited: Set<string>,
    currentRoute: string[],
    depth: number,
  ) {
    // Check depth limit
    if (depth > maxDepth) {
      return
    }

    // Check if we've reached the target
    if (currentToken === targetToken) {
      const route = calculateAmountOut({
        amountIn,
        route: currentRoute,
        vertices,
      })

      if (
        route &&
        (!currentBestRoute || route.amountOut > currentBestRoute.amountOut)
      ) {
        currentBestRoute = route
      }
      return
    }

    // Mark current token as visited
    visited.add(currentToken)

    // Explore adjacent tokens
    const adjacentTokens = graph.get(currentToken) || []
    for (const adjacentToken of adjacentTokens) {
      if (!visited.has(adjacentToken)) {
        currentRoute.push(adjacentToken)
        dfs(adjacentToken, targetToken, visited, currentRoute, depth + 1)
        currentRoute.pop()
      }
    }

    // Backtrack: remove current token from visited
    visited.delete(currentToken)
  }

  // Start DFS from the input token
  const visited = new Set<string>()
  const currentRoute = [tokenIn]
  dfs(tokenIn, tokenOut, visited, currentRoute, 0)

  return currentBestRoute
}
