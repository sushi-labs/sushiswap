'use client'

import {
  LIFI_XSWAP_SUPPORTED_CHAIN_IDS,
  type LifiXSwapSupportedChainId,
  getSortedChainIds,
} from 'src/config'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi'
import { useLifiXSwap } from './xswap-provider'

const networks = getSortedChainIds(LIFI_XSWAP_SUPPORTED_CHAIN_IDS)

export function CrossChainSwapToken0Input<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>() {
  const {
    state: { swapAmountString, chainId0, token0 },
    mutate: { setSwapAmount, setToken0, setChainId0 },
    isToken0Loading: isLoading,
  } = useLifiXSwap<TChainId0, TChainId1>()

  return (
    <Web3Input.Currency
      id="swap-from"
      type="INPUT"
      className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
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
