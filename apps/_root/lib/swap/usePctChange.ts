import { useMemo } from 'react'
import { ZERO } from '@sushiswap/math'
import { useSwapState } from '../../ui/swap/trade/TradeProvider'
import { usePrice } from '@sushiswap/react-query'
import { useTrade } from './useTrade'

export const usePctChange = () => {
  const { token1, token0, network0, network1, amount } = useSwapState()
  const { data: price0 } = usePrice({ chainId: network0, address: token0?.wrapped?.address })
  const { data: price1 } = usePrice({ chainId: network1, address: token1?.wrapped?.address })
  const { data: trade } = useTrade({ crossChain: network0 !== network1 })

  return useMemo(() => {
    if (!trade?.priceImpact) return undefined

    const inputUSD = amount && price0 ? amount.multiply(price0.asFraction) : undefined
    const outputUSD = trade?.amountOut && price1 ? trade.amountOut.multiply(price1.asFraction) : undefined
    return inputUSD && outputUSD && inputUSD?.greaterThan(ZERO)
      ? ((Number(outputUSD?.toExact()) - Number(inputUSD?.toExact())) / Number(inputUSD?.toExact())) * 100
      : undefined
  }, [trade?.priceImpact, trade?.amountOut, amount, price0, price1])
}
