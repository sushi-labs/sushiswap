'use client'

import type { LifiXSwapSupportedChainId } from 'src/config'
import { VALUE_TRANSFER_SUPPORTED_CHAIN_IDS } from 'src/lib/swap/value-transfer/types'
import { isWNativeSupported } from 'sushi'
import { XSwapCurrencyInput } from '../xswap-currency-input'
import { useXSwapForm } from '../xswap-form-provider'
import { useLifiXSwap, useLifiXSwapSelectedTradeRoute } from './xswap-provider'

const networks = VALUE_TRANSFER_SUPPORTED_CHAIN_IDS

export function CrossChainSwapToken1Input<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>() {
  const {
    state: { chainId1, token1 },
    mutate: { setToken1 },
    isToken1Loading: tokenLoading,
  } = useLifiXSwap<TChainId0, TChainId1>()

  const {
    isLoading,
    isFetching,
    data: route,
  } = useLifiXSwapSelectedTradeRoute()

  const form = useXSwapForm()
  return (
    <XSwapCurrencyInput
      id="swap-to"
      type="OUTPUT"
      disabled
      value={route?.amountOut?.toSignificant() ?? ''}
      chainId={chainId1}
      onSelect={setToken1}
      currency={token1}
      loading={isLoading}
      disableMaxButton
      fetching={isFetching}
      currencyLoading={tokenLoading}
      allowNative={isWNativeSupported(chainId1)}
      label="Buy"
      networks={networks}
      selectedNetwork={chainId1}
      onNetworkChange={form.setChainId1}
    />
  )
}
