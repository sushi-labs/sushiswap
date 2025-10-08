'use client'

import { useQuickSelectContext } from 'src/lib/wagmi/components/token-selector/quick-select/quick-select-provider'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi/evm'
import {
  useDerivedStateSimpleSwap,
  useSimpleSwapTradeQuote,
} from './derivedstate-simple-swap-provider'

export const SimpleSwapToken1Input = () => {
  const {
    state: { chainId1: chainId, token1 },
    mutate: { setToken1 },
    isToken1Loading: tokenLoading,
  } = useDerivedStateSimpleSwap()

  const {
    isInitialLoading: isLoading,
    isFetching,
    data: quote,
  } = useSimpleSwapTradeQuote()

  const {
    state: { isEnabled },
  } = useQuickSelectContext()

  return (
    <Web3Input.Currency
      id="swap-to"
      type="OUTPUT"
      disabled
      className="p-4 bg-gray-100 dark:bg-slate-900 rounded-xl overflow-visible"
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
      showQuickSelect={isEnabled}
    />
  )
}
