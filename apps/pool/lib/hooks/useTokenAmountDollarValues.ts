import { ChainId } from '@sushiswap/chain'
import { Amount, Type } from '@sushiswap/currency'
import { usePrices } from '@sushiswap/wagmi'
import { useMemo } from 'react'
import { ZERO } from '@sushiswap/math'

interface Params {
  chainId: ChainId
  amounts: (Amount<Type> | undefined)[]
}

type UseTokenAmountDollarValues = (params: Params) => number[]

export const useTokenAmountDollarValues: UseTokenAmountDollarValues = ({ chainId, amounts }) => {
  const { data: prices } = usePrices({ chainId })

  return useMemo(() => {
    return amounts.map((amount) => {
      if (!amount?.greaterThan(ZERO) || !prices?.[amount.currency.wrapped.address]) return 0
      const price = Number(Number(amount.toExact()) * Number(prices[amount.currency.wrapped.address].toFixed(10)))

      if (isNaN(price)) {
        return 0
      }

      return price
    })
  }, [amounts, prices])
}
