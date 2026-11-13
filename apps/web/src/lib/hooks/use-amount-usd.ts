'use client'

import type { PriceChainId } from 'src/app/(networks)/(evm)/_common/ui/price-provider/price-provider/types'
import { useCurrencyPrice } from 'src/app/(networks)/(evm)/_common/ui/price-provider/price-provider/use-currency-price'
import type { Amount } from 'sushi'

export function useAmountUsd({
  amount,
  enabled = true,
}: {
  amount?: Amount<CurrencyFor<PriceChainId>> | null
  enabled?: boolean
}): { data: number | undefined; isLoading: boolean } {
  const price = useCurrencyPrice({
    currency: enabled ? amount?.currency : undefined,
    enabled: enabled && Boolean(amount),
  })
  const value =
    enabled &&
    amount &&
    !price.isError &&
    price.data !== undefined &&
    Number.isFinite(price.data) &&
    price.data > 0
      ? Number(amount.toString()) * price.data
      : undefined

  return {
    data:
      value !== undefined && Number.isFinite(value) && value >= 0
        ? value
        : undefined,
    isLoading: Boolean(enabled && amount && price.isLoading),
  }
}
