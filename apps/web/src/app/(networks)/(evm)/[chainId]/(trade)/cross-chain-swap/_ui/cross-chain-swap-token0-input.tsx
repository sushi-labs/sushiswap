'use client'

import {
  XSWAP_SUPPORTED_CHAIN_IDS,
  type XSwapSupportedChainId,
  getSortedChainIds,
} from 'src/config'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi'
import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

const networks = getSortedChainIds(XSWAP_SUPPORTED_CHAIN_IDS)

export function CrossChainSwapToken0Input<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
>() {
  const {
    state: { swapAmountString, chainId0, token0 },
    mutate: { setSwapAmount, setToken0, setChainId0 },
    isToken0Loading: isLoading,
  } = useDerivedStateCrossChainSwap<TChainId0, TChainId1>()

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
