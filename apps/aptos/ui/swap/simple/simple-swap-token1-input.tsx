import { formatNumberWithDecimals } from 'lib/common/format-number-with-decimals'
import React from 'react'
import {
  useSimpleSwapActions,
  useSimpleSwapState,
} from 'ui/swap/simple/simple-swap-provider/simple-swap-provider'
import { CurrencyInput } from '../../common/currency/currency-input/currency-input'

export const SimpleSwapToken1Input = () => {
  const { token1, outputAmount, isPriceFetching } = useSimpleSwapState()

  const outputSwapTokenAmount = outputAmount
    ? formatNumberWithDecimals(
        Number(outputAmount),
        token1 ? token1.decimals : 8,
      )
    : ''

  const { setToken1 } = useSimpleSwapActions()

  return (
    <CurrencyInput
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
