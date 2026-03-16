'use client'

import { useMemo } from 'react'
import {
  NEAR_INTENTS_CHAIN_IDS,
  type NearIntentsChainId,
} from 'src/lib/near-intents/config'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi'
import {
  useCrossChainTradeQuote,
  useDerivedStateCrossChainSwap,
} from './derivedstate-cross-chain-swap-provider'

export function CrossChainSwapToken1Input() {
  const {
    state: { chainId1, token1 },
    mutate: { setToken1, setChainId1 },
    isToken1Loading: tokenLoading,
  } = useDerivedStateCrossChainSwap()

  const { isLoading, isFetching, data: quote } = useCrossChainTradeQuote()

  const value = useMemo(() => {
    if (!quote?.quote || !token1) {
      return ''
    }

    const amountOutRaw = Number.parseFloat(quote.quote.amountOut)
    const amountOut = amountOutRaw / 10 ** token1.decimals

    return amountOut.toLocaleString(undefined, {
      maximumFractionDigits: 6,
    })
  }, [quote, token1])

  return (
    <Web3Input.Currency
      id="swap-to"
      type="OUTPUT"
      disabled
      className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
      value={value}
      chainId={chainId1}
      onSelect={setToken1}
      currency={token1}
      loading={isLoading}
      disableMaxButton
      fetching={isFetching}
      currencyLoading={tokenLoading}
      allowNative={isWNativeSupported(chainId1)}
      label="Buy"
      networks={NEAR_INTENTS_CHAIN_IDS}
      selectedNetwork={chainId1}
      onNetworkChange={(network) => setChainId1(network as NearIntentsChainId)}
    />
  )
}
