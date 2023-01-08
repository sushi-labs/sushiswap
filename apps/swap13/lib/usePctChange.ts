import { useMemo } from 'react'
import { ZERO } from '@sushiswap/math'
import { useSwapState } from '../ui/trade/TradeProvider'
import { usePrices } from '@sushiswap/react-query'
import { useTrade } from './useTrade'

export const usePctChange = () => {
  const { token1, token0, network0, valueAsAmount } = useSwapState()
  const { data: prices } = usePrices({ chainId: network0 })
  const { data: trade } = useTrade()

  return useMemo(() => {
    const srcTokenPrice = prices?.[token0.wrapped.address]
    const dstTokenPrice = prices?.[token1.wrapped.address]

    const inputUSD = valueAsAmount && srcTokenPrice ? valueAsAmount.multiply(srcTokenPrice.asFraction) : undefined
    const outputUSD = trade?.amountOut && dstTokenPrice ? trade.amountOut.multiply(dstTokenPrice.asFraction) : undefined
    return inputUSD && outputUSD && inputUSD?.greaterThan(ZERO)
      ? ((Number(outputUSD?.toExact()) - Number(inputUSD?.toExact())) / Number(inputUSD?.toExact())) * 100
      : undefined
  }, [prices, token0.wrapped.address, token1.wrapped.address, trade?.amountOut, valueAsAmount])
}
