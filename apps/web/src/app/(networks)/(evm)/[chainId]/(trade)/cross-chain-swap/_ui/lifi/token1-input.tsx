'use client'

import {
  LIFI_XSWAP_SUPPORTED_CHAIN_IDS,
  type LifiXSwapSupportedChainId,
  getSortedChainIds,
} from 'src/config'
import { isNearIntentsChainId } from 'src/lib/swap/near-intents'
import { isWNativeSupported } from 'sushi'
import { StellarChainId } from 'sushi/stellar'
import { XSwapCurrencyInput } from '../xswap-currency-input'
import { useLifiXSwap, useLifiXSwapSelectedTradeRoute } from './xswap-provider'

const lifiNetworks = getSortedChainIds(LIFI_XSWAP_SUPPORTED_CHAIN_IDS)

export function CrossChainSwapToken1Input<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>() {
  const {
    state: { chainId0, chainId1, token1 },
    mutate: { setToken1, setChainId1 },
    isToken1Loading: tokenLoading,
  } = useLifiXSwap<TChainId0, TChainId1>()

  const {
    isLoading,
    isFetching,
    data: route,
  } = useLifiXSwapSelectedTradeRoute()

  const networks = isNearIntentsChainId(chainId0)
    ? [...lifiNetworks, StellarChainId.STELLAR]
    : lifiNetworks

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
      onNetworkChange={(network) => setChainId1(network as TChainId1)}
    />
  )
}
