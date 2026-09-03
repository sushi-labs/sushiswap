'use client'

import {
  isLayerZeroChainId,
  isLayerZeroTokenParam,
} from 'src/lib/swap/layerzero/config'
import { NEAR_INTENTS_SUPPORTED_CHAIN_IDS } from 'src/lib/swap/near-intents/types'
import { StellarChainId, isStellarChainId } from 'sushi/stellar'
import { XSwapCurrencyInput } from '../xswap-currency-input'
import { useNearIntentsXSwap } from './xswap-provider'

const networks = NEAR_INTENTS_SUPPORTED_CHAIN_IDS

export function NearIntentsCrossChainSwapToken0Input() {
  const {
    state: { chainId0, chainId1, swapAmountString, token0 },
    mutate: { setChainId0, setSwapAmount, setToken0 },
    currenciesByChain,
    isLoadingTokens,
  } = useNearIntentsXSwap()
  const currencies =
    chainId0 === StellarChainId.STELLAR && !isLayerZeroChainId(chainId1)
      ? Object.fromEntries(
          Object.entries(currenciesByChain[chainId0] ?? {}).filter(
            ([address]) =>
              !isLayerZeroTokenParam(StellarChainId.STELLAR, address),
          ),
        )
      : currenciesByChain[chainId0]

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
      currencies={currencies}
      networks={networks}
      selectedNetwork={chainId0}
      onNetworkChange={(network) => setChainId0(network)}
    />
  )
}
