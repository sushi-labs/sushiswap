'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  CROSSMINT_CHECKOUT_SUPPORTED_CHAIN_IDS,
  type CrossmintCheckoutSupportedChainId,
} from 'src/config'
import {
  chainIdsToCrossmintName,
  getCrossmintCheckoutTokenEntries,
} from '../crossmint-checkout-token-catalog'
import { fetchCrossmintCheckoutTokensPage } from '../crossmint-checkout-tokens'
import {
  CROSSMINT_CLIENT_SIDE_API_KEY,
  getCrossmintEnvironment,
} from '../crossmint-config'
import type { CrossmintCheckoutTokenClass } from '../types'

export { chainIdsToCrossmintName } from '../crossmint-checkout-token-catalog'

const DEFAULT_CROSSMINT_CHECKOUT_TOKEN_CLASSES = [
  'memecoin',
  'onramp',
] as const satisfies readonly CrossmintCheckoutTokenClass[]
const DEFAULT_CROSSMINT_CHECKOUT_TOKENS_PAGE_SIZE = 100

interface UseCrossmintCheckoutTokensInput {
  chainIds?: readonly CrossmintCheckoutSupportedChainId[]
  enabled?: boolean
  limit?: number
  tokenClasses?: readonly CrossmintCheckoutTokenClass[]
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
      'checkout-token-catalog',
      { chainIds, limit, tokenClasses },
    ],
    queryFn: async ({ pageParam, signal }) => {
      if (!CROSSMINT_CLIENT_SIDE_API_KEY) {
        throw new Error('NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY is not set')
      }

      const environment = getCrossmintEnvironment(CROSSMINT_CLIENT_SIDE_API_KEY)

      const response = await fetchCrossmintCheckoutTokensPage({
        chains: chainIdsToCrossmintName(chainIds, environment),
        cursor: pageParam ?? undefined,
        limit,
        signal,
        tokenClasses,
      })

      return {
        ...response,
        data: await getCrossmintCheckoutTokenEntries({
          availabilities: response.data,
          chainIds,
          environment,
        }),
      }
    },
    enabled,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null as string | null,
    staleTime: 15 * 60 * 1000,
  })

  const data = useMemo(
    () => query.data?.pages.flatMap((page) => page.data),
    [query.data],
  )

  return { ...query, data }
}
