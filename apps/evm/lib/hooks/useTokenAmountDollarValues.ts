'use client'

import { Amount, Type } from 'sushi/currency'
import { ZERO } from 'sushi'
import { usePrices } from '@sushiswap/react-query'
import { useMemo } from 'react'

interface Params {
  chainId: number
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
        !prices?.[amount.currency.wrapped.address]
      )
        return 0
      const price = Number(
        Number(amount.toExact()) *
          Number(prices[amount.currency.wrapped.address].toFixed(10)),
      )
      if (isNaN(price) || price < 0.000001) {
        return 0
      }

      return price
    })
  }, [amounts, prices])
}
