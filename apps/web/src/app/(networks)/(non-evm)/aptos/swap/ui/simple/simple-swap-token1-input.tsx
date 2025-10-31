import React from 'react'
import { formatNumberWithDecimals } from '~aptos/_common/lib/common/format-number-with-decimals'
import { CurrencyInput } from '~aptos/_common/ui/currency/currency-input/currency-input'
import {
  useSimpleSwapActions,
  useSimpleSwapState,
} from '~aptos/swap/ui/simple/simple-swap-provider/simple-swap-provider'

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
      className="p-4 bg-gray-100 dark:bg-slate-900 rounded-xl"
      disableInsufficientBalanceError={true}
      label="Buy"
    />
  )
}
