'use client'

import { NEAR_INTENTS_SUPPORTED_CHAIN_IDS } from 'src/lib/swap/near-intents/types'
import { isStellarChainId } from 'sushi/stellar'
import { XSwapCurrencyInput } from '../xswap-currency-input'
import { useNearIntentsXSwap } from './xswap-provider'

const networks = NEAR_INTENTS_SUPPORTED_CHAIN_IDS

export function NearIntentsCrossChainSwapToken0Input() {
  const {
    state: { chainId0, swapAmountString, token0 },
    mutate: { setChainId0, setSwapAmount, setToken0 },
    currenciesByChain,
    isLoadingTokens,
  } = useNearIntentsXSwap()

  return (
    <XSwapCurrencyInput
      id="swap-from"
      type="INPUT"
      chainId={chainId0}
      onSelect={setToken0}
      value={swapAmountString}
      onChange={setSwapAmount}
      currency={token0}
      loading={isLoadingTokens}
      currencyLoading={isLoadingTokens}
      allowNative={!isStellarChainId(chainId0)}
      label="Sell"
      currencies={currenciesByChain[chainId0]}
      networks={networks}
      selectedNetwork={chainId0}
      onNetworkChange={(network) => setChainId0(network)}
    />
  )
}
