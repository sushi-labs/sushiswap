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
import { useLifiXSwap } from './xswap-provider'

const lifiNetworks = getSortedChainIds(LIFI_XSWAP_SUPPORTED_CHAIN_IDS)

export function CrossChainSwapToken0Input<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>() {
  const {
    state: { swapAmountString, chainId0, chainId1, token0 },
    mutate: { setSwapAmount, setToken0, setChainId0 },
    isToken0Loading: isLoading,
  } = useLifiXSwap<TChainId0, TChainId1>()

  const networks = isNearIntentsChainId(chainId1)
    ? [...lifiNetworks, StellarChainId.STELLAR]
    : lifiNetworks

  return (
    <XSwapCurrencyInput
      id="swap-from"
      type="INPUT"
      chainId={chainId0}
      onSelect={setToken0}
      value={swapAmountString}
      onChange={setSwapAmount}
      currency={token0}
      loading={isLoading}
      currencyLoading={isLoading}
      allowNative={isWNativeSupported(chainId0)}
      label="Sell"
      networks={networks}
      selectedNetwork={chainId0}
      onNetworkChange={(network) => setChainId0(network as TChainId0)}
    />
  )
}
