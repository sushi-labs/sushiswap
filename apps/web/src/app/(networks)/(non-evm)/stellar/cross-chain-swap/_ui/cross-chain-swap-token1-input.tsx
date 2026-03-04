'use client'

import {
  NEAR_INTENTS_CHAIN_IDS,
  type NearIntentsChainId,
} from 'src/lib/near-intents/config'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi'
import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

export function CrossChainSwapToken1Input() {
  const {
    state: { chainId1, token1 },
    mutate: { setToken1, setChainId1 },
    isToken1Loading,
  } = useDerivedStateCrossChainSwap()

  return (
    <Web3Input.Currency
      id="swap-to"
      type="OUTPUT"
      disabled
      className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
      value=""
      chainId={chainId1}
      onSelect={setToken1}
      currency={token1}
      loading={false}
      disableMaxButton
      fetching={false}
      currencyLoading={isToken1Loading}
      allowNative={isWNativeSupported(chainId1)}
      label="Buy"
      networks={NEAR_INTENTS_CHAIN_IDS}
      selectedNetwork={chainId1}
      onNetworkChange={(network) => setChainId1(network as NearIntentsChainId)}
    />
  )
}
