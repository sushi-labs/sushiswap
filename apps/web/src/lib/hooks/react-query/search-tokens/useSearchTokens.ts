import { getSearchTokens } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { Address } from 'viem'
import type { TempTokenListV2ChainId } from '../recent-swaps/useRecentsSwaps'

interface UseSearchTokens {
  walletAddress: Address | undefined
  chainIds: TempTokenListV2ChainId | undefined
  search?: string
  first?: number
  skip?: number
}

export const useSearchTokens = ({
  walletAddress,
  chainIds,
  search,
  first = 30,
  skip,
}: UseSearchTokens) => {
  return useQuery({
    queryKey: ['useSearchTokens', walletAddress, chainIds, search, first, skip],
    queryFn: async () => {
      if (!walletAddress || !chainIds) return []

      const data = await getSearchTokens({
        walletAddress,
        chainIds,
        search,
        first,
        skip,
      })

      return data ?? []
    },
    refetchInterval: 60_000,
    enabled: !!walletAddress && !!chainIds && !!search,
  })
}
