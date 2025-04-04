import {
  type GetTokenPriceChart,
  type TokenPriceChart,
  getTokenPriceChart,
} from '@sushiswap/graph-client/data-api/queries'
import { useQuery } from '@tanstack/react-query'

export function useTokenPriceChart(
  args: GetTokenPriceChart,
  shouldFetch = true,
) {
  return useQuery<TokenPriceChart>({
    queryKey: ['token-chart', args],
    queryFn: async () => await getTokenPriceChart(args),
    enabled: Boolean(shouldFetch),
  })
}
