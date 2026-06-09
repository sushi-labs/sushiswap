'use client'

import { NEAR_INTENTS_SUPPORTED_CHAIN_IDS } from 'src/lib/swap/near-intents/types'
import { Amount } from 'sushi'
import { isStellarChainId } from 'sushi/stellar'
import { XSwapCurrencyInput } from '../xswap-currency-input'
import { useNearIntentsXSwap } from './xswap-provider'

const networks = NEAR_INTENTS_SUPPORTED_CHAIN_IDS

export function NearIntentsCrossChainSwapToken1Input() {
  const {
    state: { chainId1, token1 },
    mutate: { setChainId1, setToken1 },
    currenciesByChain,
    isLoadingTokens,
    previewQuote,
  } = useNearIntentsXSwap()

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
      currencies={currenciesByChain[chainId1]}
      networks={networks}
      selectedNetwork={chainId1}
      onNetworkChange={(network) => setChainId1(network)}
    />
  )
}
