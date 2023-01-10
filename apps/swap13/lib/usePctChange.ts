import { useMemo } from 'react'
import { ZERO } from '@sushiswap/math'
import { useSwapState } from '../ui/trade/TradeProvider'
import { usePrice } from '@sushiswap/react-query'
import { useTrade } from './useTrade'

export const usePctChange = () => {
  const { token1, token0, network0, amount } = useSwapState()
  const { data: price0 } = usePrice({ chainId: network0, address: token0?.wrapped.address })
  const { data: price1 } = usePrice({ chainId: network0, address: token1?.wrapped.address })
  const { data: trade } = useTrade()

  return useMemo(() => {
    const inputUSD = amount && price0 ? amount.multiply(price0.asFraction) : undefined
    const outputUSD = trade?.amountOut && price1 ? trade.amountOut.multiply(price1.asFraction) : undefined
    return inputUSD && outputUSD && inputUSD?.greaterThan(ZERO)
      ? ((Number(outputUSD?.toExact()) - Number(inputUSD?.toExact())) / Number(inputUSD?.toExact())) * 100
      : undefined
  }, [price0, price1, trade?.amountOut, amount])
}
