'use client'

import { useMemo } from 'react'
import { PREFERRED_CHAINID_ORDER } from 'src/config'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { ChainId } from 'sushi/chain'
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
      onNetworkChange={setChainId0}
    />
  )
}
