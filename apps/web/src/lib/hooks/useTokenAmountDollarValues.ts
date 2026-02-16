'use client'

import { useMemo } from 'react'
import { type Amount, ZERO } from 'sushi'
import type { EvmChainId, EvmCurrency } from 'sushi/evm'
import type { SvmChainId } from 'sushi/svm'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'

interface Params<TChainId extends EvmChainId | SvmChainId> {
  chainId: TChainId
  amounts: (Amount<CurrencyFor<TChainId>> | undefined)[] | null | undefined
}

export function useTokenAmountDollarValues<
  TChainId extends EvmChainId | SvmChainId,
>({ chainId, amounts }: Params<TChainId>): number[] {
  const { data: prices } = usePrices({ chainId })

  return useMemo(() => {
    if (!amounts) return []

    return amounts.map((amount) => {
      const address = amount?.currency.wrap().address as AddressFor<TChainId>

      if (!amount?.gt(ZERO) || !prices?.has(address)) return 0
      const price = Number(
        Number(amount.toString()) * Number(prices.get(address)!.toFixed(10)),
      )
      if (Number.isNaN(price) || price < 0.000001) {
        return 0
      }

      return price
    })
  }, [amounts, prices])
}
