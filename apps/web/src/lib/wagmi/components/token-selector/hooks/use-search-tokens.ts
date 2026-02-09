import {
  type TokenList,
  type TokenListChainId,
  getTokenList,
} from '@sushiswap/graph-client/data-api'
import { useCustomTokens } from '@sushiswap/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { type EvmChainId, EvmToken, isEvmChainId } from 'sushi/evm'
import { type SvmChainId, SvmToken, isSvmChainId } from 'sushi/svm'

type UseSearchTokens<TChainId extends TokenListChainId> = {
  chainId: TChainId | undefined
  search?: string
  includeCustomTokens?: boolean
  pagination?: {
    pageSize: number
    initialPage: number
  }
}

type UseSearchTokensDataReturn<TChainId extends TokenListChainId> =
  TChainId extends EvmChainId
    ? EvmToken[]
    : TChainId extends SvmChainId
      ? SvmToken[]
      : never

export function useSearchTokens<TChainId extends TokenListChainId>({
  chainId,
  search,
  includeCustomTokens = true,
  pagination: _pagination,
}: UseSearchTokens<TChainId>) {
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

  const data = useMemo(() => {
    if (!query.data || !chainId) return undefined

    if (isEvmChainId(chainId)) {
      const tokens = query.data.pages.flat() as TokenList<
        TokenListChainId & EvmChainId
      >
      return tokens.map(
        (token) =>
          new EvmToken({ ...token, metadata: { approved: token.approved } }),
      )
    }

    if (isSvmChainId(chainId)) {
      const tokens = query.data.pages.flat() as TokenList<
        TokenListChainId & SvmChainId
      >
      return tokens.map(
        (token) =>
          new SvmToken({ ...token, metadata: { approved: token.approved } }),
      )
    }
  }, [chainId, query.data]) as UseSearchTokensDataReturn<TChainId> | undefined

  return useMemo(
    () => ({
      ...query,
      data,
      hasMore:
        query.data?.pages[query.data.pages.length - 1].length ===
        pagination.pageSize,
    }),
    [pagination.pageSize, query, data],
  )
}
