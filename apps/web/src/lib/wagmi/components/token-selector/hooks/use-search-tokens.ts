import {
  type TokenListChainId,
  getTokenList,
} from '@sushiswap/graph-client/data-api'
import { useCustomTokens } from '@sushiswap/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { EvmToken } from 'sushi/evm'

type UseSearchTokens = {
  chainId: TokenListChainId | undefined
  search?: string
  includeCustomTokens?: boolean
  pagination?: {
    pageSize: number
    initialPage: number
  }
}

export function useSearchTokens({
  chainId,
  search,
  includeCustomTokens = true,
  pagination: _pagination,
}: UseSearchTokens) {
  const pagination = _pagination || { pageSize: 50, initialPage: 0 }

  const { data: _customTokens } = useCustomTokens()
  const customTokens = useMemo(() => {
    if (!includeCustomTokens) return undefined

    return Object.values(_customTokens)
      .filter((t) => t.chainId === chainId)
      .map((t) => t.address)
  }, [_customTokens, chainId, includeCustomTokens])

  const query = useInfiniteQuery({
    queryKey: [
      'data-api-token-list',
      { chainId, symbol: search, pageSize: pagination.pageSize, customTokens },
    ],
    queryFn: async ({ pageParam }) => {
      if (!chainId) throw new Error('chainId is required')

      const result = await getTokenList({
        chainId,
        first: pagination.pageSize,
        skip: pageParam * pagination.pageSize,
        search,
        customTokens,
      })
      return result
    },
    enabled: !!chainId,
    getNextPageParam: (_1, _2, lastPageParam) => lastPageParam + 1,
    initialPageParam: pagination.initialPage,
    // 15 minutes
    staleTime: 15 * 60 * 1000,
  })

  return useMemo(
    () => ({
      ...query,
      data: query.data?.pages
        .flat()
        .map(
          (token) =>
            new EvmToken({ ...token, metadata: { approved: token.approved } }),
        ),
      hasMore:
        query.data?.pages[query.data.pages.length - 1].length ===
        pagination.pageSize,
    }),
    [pagination.pageSize, query],
  )
}
