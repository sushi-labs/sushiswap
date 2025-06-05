'use client'

import { XSWAP_SUPPORTED_CHAIN_IDS, getSortedChainIds } from 'src/config'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi/config'
import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

const networks = getSortedChainIds(XSWAP_SUPPORTED_CHAIN_IDS)

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
      className="p-4 bg-gray-100 dark:bg-slate-900 rounded-xl"
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
      onNetworkChange={setChainId0}
    />
  )
}
