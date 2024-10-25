'use client'

import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import {
  SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS,
  isWNativeSupported,
} from 'sushi/config'
import {
  useCrossChainSwapTrade,
  useDerivedStateCrossChainSwap,
} from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapToken1Input = () => {
  const {
    state: { chainId1, token1 },
    mutate: { setToken1, setChainId1 },
    isToken1Loading: tokenLoading,
  } = useDerivedStateCrossChainSwap()

  const {
    isInitialLoading: isLoading,
    isFetching,
    data: trade,
  } = useCrossChainSwapTrade()

  return (
    <Web3Input.Currency
      id="swap-to"
      type="OUTPUT"
      disabled
      className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
      value={trade?.amountOut?.toSignificant() ?? ''}
      chainId={chainId1}
      onSelect={setToken1}
      currency={token1}
      loading={isLoading}
      disableMaxButton
      fetching={isFetching}
      currencyLoading={tokenLoading}
      allowNative={isWNativeSupported(chainId1)}
      label="Buy"
      networks={SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS}
      selectedNetwork={chainId1}
      onNetworkChange={setChainId1}
    />
  )
}
