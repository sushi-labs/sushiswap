import {
  type TokenListV2ChainId,
  getSearchTokens,
} from '@sushiswap/graph-client/data-api'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { Address } from 'viem'

type TokenListEntry = NonNullable<
  Awaited<ReturnType<typeof getSearchTokens>>
>[number]

interface UseSearchTokens {
  walletAddress: Address | undefined
  chainIds: TokenListV2ChainId[] | undefined
  search?: string
  first?: number
  tokens?: { address: Address; chainId: unknown }[]
}

export const useSearchTokens = ({
  walletAddress,
  chainIds,
  search,
  first = 30,
  tokens = [],
}: UseSearchTokens) => {
  const result = useInfiniteQuery<TokenListEntry[], unknown>({
    queryKey: [
      'useSearchTokens',
      walletAddress,
      chainIds,
      search,
      first,
      tokens,
    ],
    enabled: !!walletAddress && !!chainIds && (!!search || tokens.length > 0),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < first ? undefined : allPages.length * first
    },
    queryFn: async ({ pageParam = 0 }) => {
      if (!walletAddress || !chainIds) return []

      const skip = pageParam as number
      const data = await getSearchTokens({
        account: walletAddress,
        chainIds,
        search,
        first,
        skip,
        tokens,
      })

      return Array.isArray(data) ? data : []
    },
  })

  return {
    ...result,
    data: result.data?.pages.flat() ?? [],
  }
}
