'use client'

import {
  LIFI_XSWAP_SUPPORTED_CHAIN_IDS,
  type LifiXSwapSupportedChainId,
  getSortedChainIds,
} from 'src/config'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi'
import {
  useLifiXSwap,
  useLifiXSwapSelectedTradeRoute,
} from './lifi-xswap-provider'

const networks = getSortedChainIds(LIFI_XSWAP_SUPPORTED_CHAIN_IDS)

export function CrossChainSwapToken1Input<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>() {
  const {
    state: { chainId1, token1 },
    mutate: { setToken1, setChainId1 },
    isToken1Loading: tokenLoading,
  } = useLifiXSwap<TChainId0, TChainId1>()

  const {
    isLoading,
    isFetching,
    data: route,
  } = useLifiXSwapSelectedTradeRoute()

  return (
    <Web3Input.Currency
      id="swap-to"
      type="OUTPUT"
      disabled
      className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
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
