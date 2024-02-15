import { useSwapActions, useSwapState } from 'app/swap/trade/TradeProvider'
import React from 'react'
import { formatNumber } from 'utils/utilFunctions'
import { TradeInput } from './TradeInput'

export const SwapTradeOutput = () => {
  const { token1, outputAmount, isPriceFetching } = useSwapState()

  const outputSwapTokenAmount = outputAmount
    ? formatNumber(Number(outputAmount), token1 ? token1.decimals : 8)
    : ''

  const { setToken1 } = useSwapActions()

  return (
    <TradeInput
      id="swap-to"
      onSelect={setToken1}
      token={token1}
      fetching={isPriceFetching}
      disabled={true}
      type="OUTPUT"
      value={outputSwapTokenAmount}
      className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
      disableInsufficientBalanceError={true}
    />
  )
}
