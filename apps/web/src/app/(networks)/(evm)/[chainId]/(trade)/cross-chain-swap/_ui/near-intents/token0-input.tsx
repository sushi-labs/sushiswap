'use client'

import { VALUE_TRANSFER_SUPPORTED_CHAIN_IDS } from 'src/lib/swap/value-transfer/types'
import { isStellarChainId } from 'sushi/stellar'
import { XSwapCurrencyInput } from '../xswap-currency-input'
import { useXSwapForm } from '../xswap-form-provider'
import { getNearIntentsSelectableCurrencies } from './hooks/use-near-intents-currency-catalog'
import { useNearIntentsXSwap } from './xswap-provider'

const networks = VALUE_TRANSFER_SUPPORTED_CHAIN_IDS

export function NearIntentsCrossChainSwapToken0Input() {
  const {
    state: { chainId0, chainId1, swapAmountString, token0 },
    mutate: { setSwapAmount, setToken0 },
    currenciesByChain,
    isLoadingTokens,
  } = useNearIntentsXSwap()
  const currencies = getNearIntentsSelectableCurrencies(
    chainId0,
    chainId1,
    currenciesByChain[chainId0],
  )

  const form = useXSwapForm()
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
      onNetworkChange={form.setChainId0}
    />
  )
}
