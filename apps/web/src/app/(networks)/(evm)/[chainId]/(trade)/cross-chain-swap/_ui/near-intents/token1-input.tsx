'use client'

import {
  isLayerZeroChainId,
  isLayerZeroTokenParam,
} from 'src/lib/swap/layerzero/config'
import { NEAR_INTENTS_SUPPORTED_CHAIN_IDS } from 'src/lib/swap/near-intents/types'
import { Amount } from 'sushi'
import { StellarChainId, isStellarChainId } from 'sushi/stellar'
import { XSwapCurrencyInput } from '../xswap-currency-input'
import { useNearIntentsXSwap } from './xswap-provider'

const networks = NEAR_INTENTS_SUPPORTED_CHAIN_IDS

export function NearIntentsCrossChainSwapToken1Input() {
  const {
    state: { chainId0, chainId1, token1 },
    mutate: { setChainId1, setToken1 },
    currenciesByChain,
    isLoadingTokens,
    previewQuote,
  } = useNearIntentsXSwap()
  const currencies =
    chainId1 === StellarChainId.STELLAR && !isLayerZeroChainId(chainId0)
      ? Object.fromEntries(
          Object.entries(currenciesByChain[chainId1] ?? {}).filter(
            ([address]) =>
              !isLayerZeroTokenParam(StellarChainId.STELLAR, address),
          ),
        )
      : currenciesByChain[chainId1]

  const amountOut =
    token1 && previewQuote.data?.quote.amountOut
      ? new Amount(token1, previewQuote.data.quote.amountOut).toSignificant()
      : ''
  return (
    <XSwapCurrencyInput
      id="swap-to"
      type="OUTPUT"
      disabled
      value={amountOut}
      chainId={chainId1}
      onSelect={setToken1}
      currency={token1}
      loading={previewQuote.isLoading}
      disableMaxButton
      fetching={previewQuote.isFetching}
      currencyLoading={isLoadingTokens}
      allowNative={!isStellarChainId(chainId1)}
      label="Buy"
      currencies={currencies}
      networks={networks}
      selectedNetwork={chainId1}
      onNetworkChange={(network) => setChainId1(network)}
    />
  )
}
