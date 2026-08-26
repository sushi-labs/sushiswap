'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  CROSSMINT_CHECKOUT_SUPPORTED_CHAIN_IDS,
  type CrossmintCheckoutSupportedChainId,
} from 'src/config'
import { ChainId, getChainById } from 'sushi'
import {
  fetchCrossmintCheckoutTokensPage,
  getAvailableCrossmintCheckoutTokens,
} from '../crossmint-checkout-tokens'
import type { CrossmintCheckoutTokenClass } from '../types'

export const DEFAULT_CROSSMINT_CHECKOUT_TOKEN_CLASSES = [
  'memecoin',
  'onramp',
] as const satisfies readonly CrossmintCheckoutTokenClass[]
export const DEFAULT_CROSSMINT_CHECKOUT_TOKENS_PAGE_SIZE = 100

export interface UseCrossmintCheckoutTokensInput {
  chainIds?: readonly CrossmintCheckoutSupportedChainId[]
  enabled?: boolean
  limit?: number
  tokenClasses?: readonly CrossmintCheckoutTokenClass[]
}

const CROSSMINT_CHAIN_NAMES: Partial<Record<ChainId, string>> = {
  [ChainId.ARBITRUM]: 'arbitrum',
  [ChainId.BSC]: 'bsc',
  [ChainId.MODE]: 'mode',
  [ChainId.OPTIMISM]: 'optimism',
  [ChainId.ROBINHOOD]: 'robinhood-chain',
}

export function chainIdsToCrossmintName(
  chainIds: readonly CrossmintCheckoutSupportedChainId[],
): string[] {
  return chainIds.map(
    (chainId) =>
      CROSSMINT_CHAIN_NAMES[chainId] ??
      getChainById(chainId).name.toLowerCase(),
  )
}

export function useCrossmintCheckoutTokens({
  chainIds = CROSSMINT_CHECKOUT_SUPPORTED_CHAIN_IDS,
  enabled = true,
  limit = DEFAULT_CROSSMINT_CHECKOUT_TOKENS_PAGE_SIZE,
  tokenClasses = DEFAULT_CROSSMINT_CHECKOUT_TOKEN_CLASSES,
}: UseCrossmintCheckoutTokensInput = {}) {
  const query = useInfiniteQuery({
    queryKey: [
      'crossmint',
      'checkout-tokens',
      { chainIds, limit, tokenClasses },
    ],
    queryFn: ({ pageParam, signal }) => {
      return fetchCrossmintCheckoutTokensPage({
        chains: chainIdsToCrossmintName(chainIds),
        cursor: pageParam ?? undefined,
        limit,
        signal,
        tokenClasses,
      })
    },
    enabled,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null as string | null,
    staleTime: 15 * 60 * 1000,
  })

  const data = useMemo(
    () =>
      query.data
        ? getAvailableCrossmintCheckoutTokens(query.data.pages)
        : undefined,
    [query.data],
  )

  return { ...query, data }
}
