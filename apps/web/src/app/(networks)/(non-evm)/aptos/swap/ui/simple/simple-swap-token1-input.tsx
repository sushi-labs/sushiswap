import React from 'react'
import { SwapInputLabel } from 'src/app/(networks)/(evm)/[chainId]/(trade)/_ui/swap-input-label'
import { ChainId } from 'sushi'
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
      className="border border-accent p-4 bg-muted rounded-2xl"
      disableInsufficientBalanceError={true}
      label={<SwapInputLabel chainId={ChainId.APTOS} type="OUTPUT" />}
    />
  )
}
