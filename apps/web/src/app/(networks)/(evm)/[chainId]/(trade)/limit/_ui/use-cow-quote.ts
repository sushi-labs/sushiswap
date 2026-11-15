'use client'

import {
  type UseQueryResult,
  partialMatchKey,
  useQuery,
} from '@tanstack/react-query'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import { type CowQuote, getCowQuote } from 'src/lib/swap/cow/orderbook'
import {
  getCowQuotePairQueryKey,
  getCowQuoteQueryKey,
} from 'src/lib/swap/cow/query-keys'
import { type EvmAddress, isEvmAddressEqual } from 'sushi/evm'

// The market reference for a limit price; refreshed while the form is open.
export function useCowQuote({
  chainId,
  owner,
  sellToken,
  buyToken,
  sellAmount,
  enabled,
}: {
  chainId: CowLimitChainId
  owner: EvmAddress | undefined
  sellToken: EvmAddress | undefined
  buyToken: EvmAddress | undefined
  sellAmount: string | undefined
  enabled: boolean
}): UseQueryResult<CowQuote> {
  const pair = { chainId, owner, sellToken, buyToken }
  const queryKey = getCowQuoteQueryKey({ ...pair, sellAmount })
  return useQuery({
    queryKey,
    // While a new amount loads, the last rate for the same pair stays a better
    // market reference than none; `isPlaceholderData` marks it as stale.
    placeholderData: (previous, previousQuery) =>
      previousQuery &&
      partialMatchKey(previousQuery.queryKey, getCowQuotePairQueryKey(pair))
        ? previous
        : undefined,
    queryFn: () => {
      if (!sellToken || !buyToken || !sellAmount)
        throw new Error('Select tokens and an amount')
      return getCowQuote({ chainId, owner, sellToken, buyToken, sellAmount })
    },
    enabled: Boolean(
      enabled &&
        sellToken &&
        buyToken &&
        !isEvmAddressEqual(sellToken, buyToken) &&
        sellAmount,
    ),
    refetchInterval: 20_000,
    retry: 1,
  })
}
