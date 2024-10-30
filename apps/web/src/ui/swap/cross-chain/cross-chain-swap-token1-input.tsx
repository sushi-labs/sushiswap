'use client'

import { useMemo } from 'react'
import { PREFERRED_CHAINID_ORDER } from 'src/config'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { ChainId } from 'sushi/chain'
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

  const networks = useMemo(
    () =>
      Array.from(
        new Set([
          ...(PREFERRED_CHAINID_ORDER.filter((el) =>
            SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS.includes(
              el as (typeof SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS)[number],
            ),
          ) as ChainId[]),
          ...SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS,
        ]),
      ),
    [],
  )

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
      networks={networks}
      selectedNetwork={chainId1}
      onNetworkChange={setChainId1}
    />
  )
}
