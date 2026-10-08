'use client'

import { VALUE_TRANSFER_SUPPORTED_CHAIN_IDS } from 'src/lib/swap/value-transfer/types'
import { Amount } from 'sushi'
import { isStellarChainId } from 'sushi/stellar'
import { XSwapCurrencyInput } from '../xswap-currency-input'
import { useXSwapForm } from '../xswap-form-provider'
import { getNearIntentsSelectableCurrencies } from './hooks/use-near-intents-currency-catalog'
import { useNearIntentsXSwap } from './xswap-provider'

const networks = VALUE_TRANSFER_SUPPORTED_CHAIN_IDS

export function NearIntentsCrossChainSwapToken1Input() {
  const {
    state: { chainId0, chainId1, token1 },
    mutate: { setToken1 },
    currenciesByChain,
    isLoadingTokens,
    previewQuote,
  } = useNearIntentsXSwap()
  const currencies = getNearIntentsSelectableCurrencies(
    chainId1,
    chainId0,
    currenciesByChain[chainId1],
  )

  const amountOut =
    token1 && previewQuote.data?.quote.amountOut
      ? new Amount(token1, previewQuote.data.quote.amountOut).toSignificant()
      : ''
  const form = useXSwapForm()
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
      onNetworkChange={form.setChainId1}
    />
  )
}
