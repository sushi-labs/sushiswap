'use client'

import {
  NEAR_INTENTS_CHAIN_IDS,
  type NearIntentsChainId,
} from 'src/lib/near-intents/config'
import { CurrencyInput } from '~stellar/_common/ui/currency/currency-input/currency-input'
import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

export function CrossChainSwapToken0Input() {
  const {
    state: { swapAmountString, token0 },
    mutate: { setSwapAmount, setToken0, setChainId0 },
  } = useDerivedStateCrossChainSwap()

  return (
    <CurrencyInput
      id="swap-from"
      type="INPUT"
      className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
      token={token0}
      onSelect={setToken0}
      value={swapAmountString}
      onChange={setSwapAmount}
      label="Sell"
      networks={NEAR_INTENTS_CHAIN_IDS}
      onNetworkChange={(network) => setChainId0(network as NearIntentsChainId)}
    />
  )
}
