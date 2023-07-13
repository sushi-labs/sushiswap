import React from 'react'
import TradeInput from './TradeInput'
import { useSwapActions, useSwapState } from 'app/swap/trade/TradeProvider'
import { formatNumber } from 'utils/utilFunctions'

export const SwapTradeOutput = () => {
  const { token1, balance1, isLoadingPrice, outputAmount, isPriceFetching } = useSwapState()
  const outputSwapTokenAmount = outputAmount ? String(formatNumber(parseFloat(outputAmount), token1.decimals)) : ''
  const { setToken1 } = useSwapActions()
  return (
    <TradeInput
      balance={balance1}
      setToken={setToken1}
      isLoadingPrice={isLoadingPrice || isPriceFetching}
      token={token1}
      disabled={true}
      type="OUTPUT"
      value={outputSwapTokenAmount}
    />
  )
}
