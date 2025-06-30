import {
  type TokenListV2ChainId,
  getTokenListV2,
  isTokenListV2ChainId,
} from '@sushiswap/graph-client/data-api'
import { useCustomTokens } from '@sushiswap/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Token } from 'sushi/currency'

import type { EvmChainId } from 'sushi/chain'

type UseSearchTokensV2 = {
  chainIds: TokenListV2ChainId[] | undefined
  search?: string
  includeCustomTokens?: boolean
  pagination?: {
    pageSize: number
    initialPage: number
  }
}
let priceMap: Map<string, number> | undefined = undefined
export function useSearchTokensV2({
  chainIds,
  search,
  includeCustomTokens = true,
  pagination: _pagination,
}: UseSearchTokensV2) {
  const pagination = _pagination || { pageSize: 50, initialPage: 0 }

  const { data: _customTokens } = useCustomTokens()
  const customTokens = useMemo(() => {
    if (!includeCustomTokens) return undefined
    if (!chainIds || chainIds.length === 0) return undefined

    return Object.values(_customTokens)
      .filter(
        (t) => isTokenListV2ChainId(t.chainId) && chainIds?.includes(t.chainId),
      )
      .map((t) => ({ address: t.address, chainId: t.chainId }))
  }, [_customTokens, chainIds, includeCustomTokens])

  const query = useInfiniteQuery({
    queryKey: [
      'data-api-token-list',
      { chainIds, symbol: search, pageSize: pagination.pageSize, customTokens },
    ],
    queryFn: async ({ pageParam }) => {
      if (!chainIds || chainIds.length === 0)
        throw new Error('chainIds are required')

      const result = await getTokenListV2({
        chainIds,
        first: pagination.pageSize,
        skip: pageParam * pagination.pageSize,
        search,
        customTokens,
      })
      if (result?.length) {
        if (!priceMap) {
          priceMap = new Map<string, number>()
        }
        result.forEach((token) => {
          priceMap!.set(token.id, token.priceUSD)
        })
      }
      return result
    },
    enabled: !!chainIds && chainIds.length > 0,
    getNextPageParam: (_1, _2, lastPageParam) => lastPageParam + 1,
    initialPageParam: pagination.initialPage,
    // 15 minutes
    staleTime: 15 * 60 * 1000,
  })

  return useMemo(
    () => ({
      ...query,
      data: query.data?.pages.flat().map(
        (token) =>
          new Token({
            address: token.address,
            chainId: token.chainId as EvmChainId,
            decimals: token.decimals,
            name: token.name,
            symbol: token.symbol,
            approved: token.approved,
          }),
      ),
      priceMap: priceMap,
      hasMore:
        query.data?.pages[query.data.pages.length - 1].length ===
        pagination.pageSize,
    }),
    [pagination.pageSize, query],
  )
}
