'use client'

import { getBaseTokens } from '~stellar/_common/lib/soroban/token-helpers'
import { CurrencyInput } from '~stellar/_common/ui/currency/currency-input/currency-input'
import { useStellarCrossChainSwap } from './cross-chain-swap-provider'

const baseTokens = getBaseTokens()

export function CrossChainSwapToken1Input() {
  const {
    state: { token1 },
    mutate: { setToken1 },
  } = useStellarCrossChainSwap()

  return (
    <CurrencyInput
      id="swap-to"
      type="OUTPUT"
      disabled
      className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
      token={token1 || baseTokens[0]}
      onSelect={setToken1}
      value=""
      disableInsufficientBalanceError
      label="Buy"
    />
  )
}
