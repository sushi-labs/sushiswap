'use client'

import { useMemo } from 'react'
import { usePrices } from 'src/app/(evm)/_common/ui/price-provider/price-provider/use-prices'
import type { ChainId } from 'sushi'
import { Amount, Type } from 'sushi/currency'
import { ZERO } from 'sushi/math'

interface Params {
  chainId: ChainId
  amounts: (Amount<Type> | undefined)[] | null | undefined
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
      if (
        !amount?.greaterThan(ZERO) ||
        !prices?.has(amount.currency.wrapped.address)
      )
        return 0
      const price = Number(
        Number(amount.toExact()) *
          Number(prices.get(amount.currency.wrapped.address)!.toFixed(10)),
      )
      if (Number.isNaN(price) || price < 0.000001) {
        return 0
      }

      return price
    })
  }, [amounts, prices])
}
