import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { usePrices } from '@sushiswap/wagmi'
import { useMemo } from 'react'

interface Params {
  chainId: ChainId
  amounts: Amount<Token>[]
}

type UseTokenAmountDollarValues = (params: Params) => (number | undefined)[]

export const useTokenAmountDollarValues: UseTokenAmountDollarValues = ({ chainId, amounts }) => {
  const { data: prices } = usePrices({ chainId })

  return useMemo(() => {
    return amounts.map((amount) => {
      return amount && prices?.[amount.currency.wrapped.address]
        ? Number(amount?.toExact()) * Number(prices?.[amount.currency.wrapped.address].toFixed(10))
        : undefined
    })
  }, [amounts, prices])
}
