import { useMemo } from 'react'
import { ZERO } from '@sushiswap/math'
import { useSwapState } from '../../ui/swap/trade/TradeProvider'
import { useUSDCPrice } from '@sushiswap/wagmi/future/hooks'
import { useTrade } from './useTrade'

export const usePctChange = () => {
  const { token1, token0, network0, network1, amount } = useSwapState()
  const { data: price0 } = useUSDCPrice({ currency: token0, chainId: network0 })
  const { data: price1 } = useUSDCPrice({ currency: token1, chainId: network1 })
  const { data: trade } = useTrade({ crossChain: network0 !== network1 })

  return useMemo(() => {
    if (!trade?.priceImpact) return undefined

    const inputUSD = amount && price0 ? price0.quote(amount) : undefined
    const outputUSD =
      trade?.amountOut && price1 ? price1.quote(trade.amountOut) : undefined

    return inputUSD && outputUSD && inputUSD.greaterThan(ZERO)
      ? ((Number(outputUSD?.toExact()) - Number(inputUSD?.toExact())) / Number(inputUSD?.toExact())) * 100
      : undefined
  }, [trade?.priceImpact, trade?.amountOut, amount, price0, price1])
}
