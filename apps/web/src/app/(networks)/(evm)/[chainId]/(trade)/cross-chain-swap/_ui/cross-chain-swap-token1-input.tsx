'use client'

import { XSWAP_SUPPORTED_CHAIN_IDS, getSortedChainIds } from 'src/config'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isEvmWNativeSupported } from 'sushi/evm'
import {
  useDerivedStateCrossChainSwap,
  useSelectedCrossChainTradeRoute,
} from './derivedstate-cross-chain-swap-provider'

const networks = getSortedChainIds(XSWAP_SUPPORTED_CHAIN_IDS)

export const CrossChainSwapToken1Input = () => {
  const {
    state: { chainId1, token1 },
    mutate: { setToken1, setChainId1 },
    isToken1Loading: tokenLoading,
  } = useDerivedStateCrossChainSwap()

  const {
    isLoading,
    isFetching,
    data: route,
  } = useSelectedCrossChainTradeRoute()

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
      allowNative={isEvmWNativeSupported(chainId1)}
      label="Buy"
      networks={networks}
      selectedNetwork={chainId1}
      onNetworkChange={setChainId1}
    />
  )
}
