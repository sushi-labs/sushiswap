'use client'

import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'

import { useDerivedStateSimpleSwap, useSimpleSwapTrade } from './derivedstate-simple-swap-provider'

export const SimpleSwapToken1Input = () => {
  const {
    state: { swapAmountString, chainId, token1 },
    mutate: { setToken1 },
    isLoading: tokensLoading,
  } = useDerivedStateSimpleSwap()

  const { isLoading, isFetching, data: trade } = useSimpleSwapTrade()
  const loading = Boolean(isLoading && +swapAmountString > 0) || isFetching || tokensLoading

  return (
    <Web3Input.Currency
      id="swap-to"
      type="OUTPUT"
      disabled
      className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
      value={trade?.amountOut?.toSignificant() ?? ''}
      chainId={chainId}
      onSelect={setToken1}
      currency={token1}
      loading={loading}
      disableMaxButton
      currencyLoading={tokensLoading}
    />
  )
}
