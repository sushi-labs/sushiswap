import React from 'react'
import { formatTokenBalance } from '~stellar/_common/lib/utils/formatters'
import {
  useSimpleSwapActions,
  useSimpleSwapState,
} from '~stellar/_common/ui/Swap/simple/simple-swap-provider/simple-swap-provider'
import { CurrencyInput } from '~stellar/_common/ui/currency/currency-input/currency-input'

export const SimpleSwapToken1Input = () => {
  const { token1, outputAmount, isPriceFetching } = useSimpleSwapState()
  const { setToken1 } = useSimpleSwapActions()

  const outputSwapTokenAmount = outputAmount
    ? formatTokenBalance(outputAmount, token1, token1.decimals)
    : ''

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
      label="Buy"
    />
  )
}
