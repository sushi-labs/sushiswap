import {
  type TrendingTokens,
  type TrendingTokensChainId,
  getTrendingTokens,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { type EvmChainId, EvmToken, isEvmChainId } from 'sushi/evm'
import { type SvmChainId, SvmToken, isSvmChainId } from 'sushi/svm'

type UseTrendingTokens<TChainId extends TrendingTokensChainId> = {
  chainId: TChainId | undefined
}

type UseTrendingTokensDataReturn<TChainId extends TrendingTokensChainId> =
  TChainId extends EvmChainId
    ? EvmToken[]
    : TChainId extends SvmChainId
      ? SvmToken[]
      : never

export function useTrendingTokens<TChainId extends TrendingTokensChainId>({
  chainId,
}: UseTrendingTokens<TChainId>) {
  const query = useQuery({
    queryKey: ['data-api-trending-list', { chainId }],
    queryFn: async () => {
      if (!chainId) throw new Error('chainId is required')

      return getTrendingTokens({
        chainId,
      })
    },
    enabled: Boolean(chainId),
    // 1 hour
    staleTime: 3600 * 1000,
  })

  return useMemo(() => {
    if (!query.data || !chainId) return { ...query, data: undefined }

    let _tokens: (EvmToken | SvmToken)[] = []

    if (isEvmChainId(chainId)) {
      const tokens = query.data as TrendingTokens<
        TrendingTokensChainId & EvmChainId
      >

      _tokens = tokens.map(
        (token) =>
          new EvmToken({ ...token, metadata: { approved: token.approved } }),
      )
    } else if (isSvmChainId(chainId)) {
      const tokens = query.data as TrendingTokens<
        TrendingTokensChainId & SvmChainId
      >

      _tokens = tokens.map(
        (token) =>
          new SvmToken({ ...token, metadata: { approved: token.approved } }),
      )
    }

    return {
      ...query,
      data: _tokens as UseTrendingTokensDataReturn<TChainId>,
    }
  }, [query, chainId])
}
