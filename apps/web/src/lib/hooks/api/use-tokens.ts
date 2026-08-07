import {
  type GetTokens,
  type TokensResponse,
  getTokens,
} from '@sushiswap/graph-client/data-api/queries'
import { useQuery } from '@tanstack/react-query'

export function useTokens(args: GetTokens, shouldFetch = true) {
  return useQuery<TokensResponse>({
    queryKey: ['explore-tokens', args],
    queryFn: async () => await getTokens(args),
    enabled: Boolean(shouldFetch),
  })
}
