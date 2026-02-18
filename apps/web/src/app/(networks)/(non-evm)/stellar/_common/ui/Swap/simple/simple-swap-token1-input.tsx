import React from 'react'
import { formatUnits } from 'viem'
import {
  useSimpleSwapActions,
  useSimpleSwapState,
} from '~stellar/_common/ui/Swap/simple/simple-swap-provider/simple-swap-provider'
import { CurrencyInput } from '~stellar/_common/ui/currency/currency-input/currency-input'

export const SimpleSwapToken1Input = () => {
  const { token1, outputAmount, isPriceFetching } = useSimpleSwapState()
  const { setToken1 } = useSimpleSwapActions()

  const outputSwapTokenAmount =
    outputAmount && token1 ? formatUnits(outputAmount, token1?.decimals) : ''

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
