'use client'

import type { PriceChainId } from './types'
import { usePrice } from './use-price'

export function useCurrencyPrice<TChainId extends PriceChainId>({
  currency,
  enabled = true,
}: {
  currency: CurrencyFor<TChainId> | undefined
  enabled?: boolean
}) {
  const token = currency?.wrap()

  const price = usePrice({
    chainId: token?.chainId,
    address: token?.address,
    enabled: Boolean(enabled && token),
  })

  if (!currency || !enabled) {
    return {
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
    }
  }

  return {
    data: price.data,
    isLoading: price.isLoading,
    isFetching: price.isUpdating,
    isError: price.isError,
  }
}
