'use client'

import { useMemo } from 'react'
import { type Amount, ZERO } from 'sushi'
import type { EvmChainId, EvmCurrency } from 'sushi/evm'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'

interface Params {
  chainId: EvmChainId
  amounts: (Amount<EvmCurrency> | undefined)[] | null | undefined
}

type UseTokenAmountDollarValues = (params: Params) => number[]

export const useTokenAmountDollarValues: UseTokenAmountDollarValues = ({
  chainId,
  amounts,
}) => {
  const { data: prices } = usePrices({ chainId })

  return useMemo(() => {
    if (!amounts) return []

    return amounts.map((amount) => {
      if (!amount?.gt(ZERO) || !prices?.has(amount.currency.wrap().address))
        return 0
      const price = Number(
        Number(amount.toString()) *
          Number(prices.get(amount.currency.wrap().address)!.toFixed(10)),
      )
      if (Number.isNaN(price) || price < 0.000001) {
        return 0
      }

      return price
    })
  }, [amounts, prices])
}
