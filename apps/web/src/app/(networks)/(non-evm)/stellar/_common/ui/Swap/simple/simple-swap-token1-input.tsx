import React from 'react'
import { formatDecimal } from '~stellar/_common/lib/utils/formatters'
import {
  useSimpleSwapActions,
  useSimpleSwapState,
} from '~stellar/_common/ui/Swap/simple/simple-swap-provider/simple-swap-provider'
import { CurrencyInput } from '~stellar/_common/ui/currency/currency-input/currency-input'

export const SimpleSwapToken1Input = () => {
  const { token1, outputAmount } = useSimpleSwapState()

  const outputSwapTokenAmount = outputAmount
    ? formatDecimal(Number(outputAmount), token1 ? token1.decimals : 7)
    : ''

  const { setToken1 } = useSimpleSwapActions()

  return (
    <CurrencyInput
      id="swap-to"
      onSelect={setToken1}
      token={token1}
      fetching={false}
      disabled={true}
      type="OUTPUT"
      value={outputSwapTokenAmount}
      className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
      disableInsufficientBalanceError={true}
      label="Buy"
    />
  )
}
