'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import { type CowQuote, getCowQuote } from 'src/lib/swap/cow/orderbook'
import { getCowQuoteQueryKey } from 'src/lib/swap/cow/query-keys'
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
  return useQuery({
    queryKey: getCowQuoteQueryKey({
      chainId,
      owner,
      sellToken,
      buyToken,
      sellAmount,
    }),
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
