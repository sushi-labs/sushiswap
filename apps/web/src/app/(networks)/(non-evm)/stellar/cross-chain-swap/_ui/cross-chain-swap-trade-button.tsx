'use client'

import { Button } from '@sushiswap/ui'
import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

export function CrossChainSwapTradeButton() {
  const {
    state: { swapAmountString, token0, token1, recipient },
  } = useDerivedStateCrossChainSwap()

  const isDisabled = !token0 || !token1 || !swapAmountString || !recipient

  return (
    <Button
      type="button"
      disabled={isDisabled}
      color="blue"
      fullWidth
      size="xl"
      testId="swap"
      className="mt-4"
    >
      {isDisabled ? 'Enter amount and recipient' : 'Swap'}
    </Button>
  )
}
