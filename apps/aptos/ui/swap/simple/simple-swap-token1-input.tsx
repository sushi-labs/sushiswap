import React from 'react'
import {
  useSimpleSwapActions,
  useSimpleSwapState,
} from 'ui/swap/simple/simple-swap-provider/simple-swap-provider'
import { formatNumber } from 'utils/format-number'
import { TradeInput } from '../../../components/TradeInput'

export const SimpleSwapToken1Input = () => {
  const { token1, outputAmount, isPriceFetching } = useSimpleSwapState()

  const outputSwapTokenAmount = outputAmount
    ? formatNumber(Number(outputAmount), token1 ? token1.decimals : 8)
    : ''

  const { setToken1 } = useSimpleSwapActions()

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
