import { useQuery } from '@tanstack/react-query'
import { getTokenByContract } from '~stellar/_common/lib/soroban/token-helpers'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { getBestRoute } from '../swap-get-route'
import type { RouteWithTokens } from '../swap-get-route'
import { usePoolGraph } from '../swap-get-route'

interface UseBestRouteParams {
  tokenIn: Token | null
  tokenOut: Token | null
  amountIn: bigint
  enabled?: boolean
}

/**
 * Hook to find the best swap route using graph-based routing
 *
 * This hook:
 * 1. Builds a graph of available pools
 * 2. Uses DFS to find all possible routes
 * 3. Calculates output amounts for each route
 * 4. Returns the route with the best output
 */
export function useBestRoute({
  tokenIn,
  tokenOut,
  amountIn,
  enabled = true,
}: UseBestRouteParams) {
  // Get the pool graph
  const { data: poolGraphData, isLoading: isLoadingGraph } = usePoolGraph()

  // Find the best route
  const routeQuery = useQuery({
    queryKey: [
      'stellar',
      'best-route',
      tokenIn?.contract,
      tokenOut?.contract,
      amountIn.toString(),
    ],
    queryFn: async (): Promise<RouteWithTokens | null> => {
      if (!tokenIn || !tokenOut || !poolGraphData) {
        return null
      }

      if (amountIn === 0n) {
        return null
      }

      console.log(
        `🔍 Finding best route: ${tokenIn.code} → ${tokenOut.code}, amount: ${amountIn}`,
      )

      const { vertices, tokenGraph } = poolGraphData

      // Run routing algorithm
      const route = getBestRoute({
        amountIn,
        vertices,
        tokenGraph,
        tokenIn,
        tokenOut,
        maxHops: 3, // Allow up to 3 hops (4 tokens in path)
      })

      if (!route) {
        console.log('❌ No route found')
        return null
      }

      // Convert route addresses to Token objects
      const tokens: Token[] = route.route
        .map((address) => getTokenByContract(address))
        .filter((token): token is Token => token !== null)

      if (tokens.length !== route.route.length) {
        console.error('Failed to resolve all tokens in route')
        return null
      }

      console.log(`✅ Best route found:`)
      console.log(`   Path: ${tokens.map((t) => t.code).join(' → ')}`)
      console.log(`   Output: ${route.amountOut}`)
      console.log(`   Price Impact: ${route.priceImpact.toFixed(2)}%`)
      console.log(
        `   Fees: ${route.fees.map((f) => `${f / 10000}%`).join(', ')}`,
      )

      return {
        ...route,
        tokens,
      }
    },
    enabled:
      enabled &&
      !!tokenIn &&
      !!tokenOut &&
      !!poolGraphData &&
      amountIn > 0n &&
      tokenIn.contract !== tokenOut.contract,
    staleTime: 1000 * 10, // 10 seconds
    gcTime: 1000 * 30, // 30 seconds
  })

  return {
    route: routeQuery.data,
    isLoading: isLoadingGraph || routeQuery.isLoading,
    isError: routeQuery.isError,
    error: routeQuery.error,
  }
}
