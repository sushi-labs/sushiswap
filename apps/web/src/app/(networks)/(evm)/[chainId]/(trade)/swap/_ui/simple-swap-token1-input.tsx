'use client'

import { SwapInputLabel } from 'src/app/(networks)/(evm)/[chainId]/(trade)/_ui/swap-input-label'
import { isTokenSelectorPair } from 'src/lib/wagmi/components/token-selector/selection'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/currency'
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
    <CurrencyInput
      id="swap-to"
      type="OUTPUT"
      disabled
      className="border border-accent p-4 bg-muted rounded-2xl"
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
      label={<SwapInputLabel chainId={chainId} type="OUTPUT" />}
    />
  )
}
