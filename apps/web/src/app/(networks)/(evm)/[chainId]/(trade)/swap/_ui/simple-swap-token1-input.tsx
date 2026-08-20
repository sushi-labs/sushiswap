'use client'

import { isTokenSelectorPair } from 'src/lib/wagmi/components/token-selector/selection'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi'
import {
  useDerivedStateSimpleSwap,
  useSimpleSwapTradeQuote,
} from './derivedstate-simple-swap-provider'

export const SimpleSwapToken1Input = () => {
  const {
    state: { chainId, token1 },
    mutate: { setToken1, setTokens },
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
      onSelect={(selection) =>
        isTokenSelectorPair(selection)
          ? setTokens(...selection)
          : setToken1(selection)
      }
      allowPairSelection
      currency={token1}
      loading={isLoading}
      fetching={isFetching}
      disableMaxButton
      currencyLoading={tokenLoading}
      allowNative={isWNativeSupported(chainId)}
      label="Buy"
    />
  )
}
