import { Amount, Currency } from '@sushiswap/currency'
import { TradeType } from '@sushiswap/amm'
import { QueryFunction, QueryKey, QueryOptions } from '@tanstack/react-query'
import { useProvider, useQuery } from 'wagmi'

export const usePools = ({
  chainId,
  currencies,
}: {
  chainId: number | undefined
  currencies: [Currency | undefined, Currency | undefined][]
}) => {
  const provider = useProvider({ chainId })
  return useQuery<QueryKey, QueryFunction, QueryOptions>(['pools', chainId, currencies], async () => {
    return []
  })
}

export const useTrade = ({
  chainId,
  tradeType,
  amountSpecified,
  mainCurrency,
  otherCurrency,
}: {
  chainId: number | undefined
  tradeType: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT
  amountSpecified?: Amount<Currency>
  mainCurrency?: Currency
  otherCurrency?: Currency
}) => {
  return useQuery<QueryKey, QueryFunction, QueryOptions>(
    ['trade', chainId, tradeType, amountSpecified, mainCurrency, otherCurrency],
    async () => {
      return []
    }
  )
}
