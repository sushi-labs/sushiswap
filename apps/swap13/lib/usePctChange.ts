import { useMemo } from 'react'
import { tryParseAmount } from '@sushiswap/currency'
import { ZERO } from '@sushiswap/math'
import { useSwapState } from '../ui/TradeProvider'
import { usePrices } from '@sushiswap/react-query'
import { useTrade } from './useTrade'

export const usePctChange = () => {
  const { value, token1, token0, network0 } = useSwapState()
  const { data: prices } = usePrices({ chainId: network0 })
  const {
    data: { amountOut },
  } = useTrade()

  return useMemo(() => {
    const amount = tryParseAmount(value, token0)
    const srcTokenPrice = prices?.[token0.wrapped.address]
    const dstTokenPrice = prices?.[token1.wrapped.address]

    const inputUSD = amount && srcTokenPrice ? amount.multiply(srcTokenPrice.asFraction) : undefined
    const outputUSD = amountOut && dstTokenPrice ? amountOut.multiply(dstTokenPrice.asFraction) : undefined
    return inputUSD && outputUSD && inputUSD?.greaterThan(ZERO)
      ? ((Number(outputUSD?.toExact()) - Number(inputUSD?.toExact())) / Number(inputUSD?.toExact())) * 100
      : undefined
  }, [amountOut, prices, token0, token1.wrapped.address, value])
}
