'use client'

import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import {
  SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS,
  isWNativeSupported,
} from 'sushi/config'
import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapToken0Input = () => {
  const {
    state: { swapAmountString, chainId0, token0 },
    mutate: { setSwapAmount, setToken0, setChainId0 },
    isToken0Loading: isLoading,
  } = useDerivedStateCrossChainSwap()

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
      networks={SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS}
      selectedNetwork={chainId0}
      onNetworkChange={setChainId0}
    />
  )
}
