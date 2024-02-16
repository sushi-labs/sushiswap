import { Token } from 'utils/tokenType'
import { computeExactOutput } from './compute-exact-output'
import { computePriceImpact } from './compute-price-impact'
import { Route, Vertex } from './types'

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
  const visitedTokens = {}
  const currentTokenRoute: string[] = []
  const allRoutes: string[][] = []

  findPossibleRoutes({
    tokenIn: tokenIn.address,
    tokenOut: tokenOut.address,
    graph: tokenGraph,
    visited: visitedTokens,
    currentRoute: currentTokenRoute,
    routes: allRoutes,
  })

  let lastOutput = 0
  const bestFinder: Route[] = []

  for (const route of allRoutes) {
    const prices = []

    if (route.length < 6) {
      if (
        vertices.has(`${route[0]}|||${route[1]}`) ||
        vertices.has(`${route[1]}|||${route[0]}`)
      ) {
        const res_x =
          vertices.get(`${route[0]}|||${route[1]}`)?.res_x ||
          vertices.get(`${route[1]}|||${route[0]}`)!.res_y
        const res_y =
          vertices.get(`${route[0]}|||${route[1]}`)?.res_y ||
          vertices.get(`${route[1]}|||${route[0]}`)!.res_x
        lastOutput = computeExactOutput({ amountIn, res_x, res_y })
        prices.push(res_y / res_x)

        if (
          vertices.has(`${route[1]}|||${route[2]}`) ||
          vertices.has(`${route[2]}|||${route[1]}`)
        ) {
          const res_x =
            vertices.get(`${route[1]}|||${route[2]}`)?.res_x ||
            vertices.get(`${route[2]}|||${route[1]}`)!.res_y
          const res_y =
            vertices.get(`${route[1]}|||${route[2]}`)?.res_y ||
            vertices.get(`${route[2]}|||${route[1]}`)!.res_x
          lastOutput = computeExactOutput({
            amountIn: lastOutput,
            res_x,
            res_y,
          })
          prices.push(res_y / res_x)

          if (
            vertices.has(`${route[2]}|||${route[3]}`) ||
            vertices.has(`${route[3]}|||${route[2]}`)
          ) {
            const res_x =
              vertices.get(`${route[2]}|||${route[3]}`)?.res_x ||
              vertices.get(`${route[3]}|||${route[2]}`)!.res_y
            const res_y =
              vertices.get(`${route[2]}|||${route[3]}`)?.res_y ||
              vertices.get(`${route[3]}|||${route[2]}`)!.res_x
            lastOutput = computeExactOutput({
              amountIn: lastOutput,
              res_x,
              res_y,
            })
            prices.push(res_y / res_x)

            if (
              vertices.has(`${route[3]}|||${route[4]}`) ||
              vertices.has(`${route[4]}|||${route[3]}`)
            ) {
              const res_x =
                vertices.get(`${route[3]}|||${route[4]}`)?.res_x ||
                vertices.get(`${route[4]}|||${route[3]}`)!.res_y
              const res_y =
                vertices.get(`${route[3]}|||${route[4]}`)?.res_y ||
                vertices.get(`${route[4]}|||${route[3]}`)!.res_x
              lastOutput = computeExactOutput({
                amountIn: lastOutput,
                res_x,
                res_y,
              })
              prices.push(res_y / res_x)
            }
          }
        }
      }

      const midPrice = prices
        .slice(1)
        .reduce(
          (accumulator, currentValue) => accumulator * currentValue,
          prices[0],
        )

      const priceImpact = computePriceImpact({
        midPrice,
        amountIn,
        amountOut: lastOutput,
      })

      bestFinder.push({
        route: route,
        amountOut: lastOutput,
        priceImpact: priceImpact,
      })
    }
  }

  const bestRoutePrice = bestFinder.length
    ? bestFinder.reduce((r, b) => (r.amountOut > b.amountOut ? r : b))
    : null

  return bestRoutePrice
}

interface FindPossibleRoutes {
  tokenIn: string
  tokenOut: string
  graph: Map<string, string[]>
  visited: Record<string, boolean>
  currentRoute: string[]
  routes: string[][]
}

function findPossibleRoutes({
  tokenIn,
  tokenOut,
  graph,
  visited,
  currentRoute,
  routes,
}: FindPossibleRoutes) {
  // Mark the current token as visited
  visited[tokenIn] = true

  // Add the current token to the current route
  currentRoute.push(tokenIn)

  // If the current token is the desired tokenOut, add the current route to the routes verticesay
  if (tokenIn === tokenOut) {
    routes.push([...currentRoute])
  } else {
    // Iterate through the adjacent tokens of the current token
    if (tokenIn) {
      for (const adjacentToken of graph.get(tokenIn)!) {
        // If the adjacent token is not visited, recursively find possible routes
        if (!visited[adjacentToken]) {
          findPossibleRoutes({
            tokenIn: adjacentToken,
            tokenOut,
            graph,
            visited,
            currentRoute,
            routes,
          })
        }
      }
    }
  }

  // Remove the current token from the current route and mark it as unvisited
  currentRoute.pop()
  visited[tokenIn] = false
}
