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
      try {
        if (!tokenIn || !tokenOut || !poolGraphData) {
          return null
        }

        if (amountIn === 0n) {
          return null
        }

        const { vertices, tokenGraph } = poolGraphData

        // Check if tokens exist in the graph
        if (
          !tokenGraph.has(tokenIn.contract) &&
          !tokenGraph.has(tokenOut.contract)
        ) {
          return null
        }

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
          return null
        }

        // Convert route addresses to Token objects
        const tokens: Token[] = route.route
          .map((address) => {
            try {
              return getTokenByContract(address)
            } catch (error) {
              console.error(
                `Error getting token by contract ${address}:`,
                error,
              )
              return null
            }
          })
          .filter((token): token is Token => token !== null)

        if (tokens.length !== route.route.length) {
          console.error('Failed to resolve all tokens in route')
          return null
        }

        return {
          ...route,
          tokens,
        }
      } catch (error) {
        console.error('Error finding best route:', error)
        // Return null instead of throwing to prevent app crash
        return null
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
    retry: false, // Don't retry on failure to prevent cascading errors
    throwOnError: false, // Don't throw errors to prevent app crash
  })

  return {
    route: routeQuery.data,
    isLoading: isLoadingGraph || routeQuery.isLoading,
    isError: routeQuery.isError,
    error: routeQuery.error,
  }
}
