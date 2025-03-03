'use client'

import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi/config'
import {
  useDerivedStateSimpleSwap,
  useSimpleSwapTradeQuote,
} from './derivedstate-simple-swap-context'

export const SimpleSwapToken1Input = () => {
  const {
    state: { chainId, token1 },
    mutate: { setToken1 },
    isToken1Loading: tokenLoading,
  } = useDerivedStateSimpleSwap()

  const {
    isInitialLoading: isLoading,
    isFetching,
    data: quote,
  } = useSimpleSwapTradeQuote()

  return (
    <Web3Input.Currency
      id="swap-to"
      type="OUTPUT"
      disabled
      className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
      value={quote?.amountOut?.toSignificant() ?? ''}
      chainId={chainId}
      onSelect={setToken1}
      currency={token1}
      loading={isLoading}
      fetching={isFetching}
      disableMaxButton
      currencyLoading={tokenLoading}
      allowNative={isWNativeSupported(chainId)}
      label="Buy"
      // priceImpact={quote?.priceImpact}
    />
  )
}
