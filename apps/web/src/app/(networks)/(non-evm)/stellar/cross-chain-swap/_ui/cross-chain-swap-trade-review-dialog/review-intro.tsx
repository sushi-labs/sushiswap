'use client'

import { Collapsible, Message } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { useDerivedStateCrossChainSwap } from '../derivedstate-cross-chain-swap-provider'

export function ReviewIntro({
  children,
  estGasError,
}: {
  children: ReactNode
  estGasError: Error | null
}) {
  const {
    state: { swapAmountString },
  } = useDerivedStateCrossChainSwap()

  const showInsufficientFunds = Boolean(
    +swapAmountString > 0 &&
      estGasError?.message?.includes('insufficient funds'),
  )

  return (
    <div className="flex flex-col">
      <Collapsible open={showInsufficientFunds}>
        <div className="pt-4">
          <Message size="sm" variant="destructive">
            Insufficient funds to cover the network fee. Please lower your input
            amount.
          </Message>
        </div>
      </Collapsible>
      <div className="mt-4">{children}</div>
    </div>
  )
}
