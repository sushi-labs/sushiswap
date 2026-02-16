import { useQueries } from '@tanstack/react-query'
import ms from 'ms'
import { formatUnits } from 'viem'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { getBestRoute } from '~stellar/swap/lib/hooks/use-best-route'
import { usePoolGraph } from '~stellar/swap/lib/swap-get-route'
import { getStableTokens } from '../../soroban'

export const useStablePrice = ({ token }: { token: Token | undefined }) => {
  // Build additional tokens list from swap input/output
  // This ensures the pool graph includes routes for the selected tokens
  const stableTokens = getStableTokens()
  const additionalTokens = [
    token?.contract,
    ...stableTokens.map((t) => t.contract),
  ].filter((t): t is string => !!t)

  // Get the pool graph, augmented with input/output tokens
  const { data: poolGraphData } = usePoolGraph({
    additionalTokens,
  })

  const stableTokenPriceQueries = useQueries({
    queries: stableTokens.map((stableToken) => {
      return {
        queryKey: [
          'stellar',
          'useStablePrice',
          token?.contract,
          stableToken.contract,
        ],
        queryFn: async (): Promise<string | null> => {
          if (!token || !poolGraphData) {
            return null
          }
          const bestRoute = await getBestRoute({
            tokenIn: token,
            tokenOut: stableToken,
            amountIn: 10n ** BigInt(token.decimals),
            poolGraphData,
          })
          const tokenPrice = formatUnits(
            bestRoute?.amountOut ?? 0n,
            stableToken.decimals,
          )
          return tokenPrice
        },
        enabled: Boolean(token && poolGraphData),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: ms('10s'),
        gcTime: ms('30s'),
        retry: 1, // Retry once on failure
        throwOnError: false,
      }
    }),
  })

  const bestPrice = stableTokenPriceQueries.reduce((maxPrice, curQuery) => {
    if (curQuery.data !== null && curQuery.data !== undefined) {
      const price = Number.parseFloat(curQuery.data)
      if (price > maxPrice) {
        return price
      }
    }
    return maxPrice
  }, 0)

  return {
    data: bestPrice,
    isLoading: stableTokenPriceQueries.some((query) => query.isLoading),
    isPending: stableTokenPriceQueries.some((query) => query.isPending),
    isFetching: stableTokenPriceQueries.some((query) => query.isFetching),
    isError: stableTokenPriceQueries.some((query) => query.isError),
  }
}
