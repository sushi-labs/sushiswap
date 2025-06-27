import {
  type TokenListV2ChainId,
  getSearchTokens,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { Address } from 'viem'

interface UseSearchTokens {
  walletAddress: Address | undefined
  chainIds: TokenListV2ChainId[] | undefined
  search?: string
  first?: number
  skip?: number
  // tokens?: { address: string; chainId: TokenListV2ChainId }[];
  tokens?: { address: Address; chainId: unknown }[]
}

export const useSearchTokens = ({
  walletAddress,
  chainIds,
  search,
  first = 30,
  skip,
  tokens = [],
}: UseSearchTokens) => {
  return useQuery({
    queryKey: [
      'useSearchTokens',
      walletAddress,
      chainIds,
      search,
      first,
      skip,
      tokens,
    ],
    queryFn: async () => {
      if (!walletAddress || !chainIds) return []

      const data = await getSearchTokens({
        walletAddress,
        chainIds: chainIds,
        search,
        first,
        skip,
        tokens,
      })

      return data ?? []
    },
    refetchInterval: 60_000,
    enabled: !!walletAddress && !!chainIds && !!search,
  })
}
