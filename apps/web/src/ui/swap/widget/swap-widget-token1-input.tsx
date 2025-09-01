'use client'

import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi/evm'
import {
  useDerivedStateSwapWidget,
  useSwapWidgetTradeQuote,
} from './derivedstate-swap-widget-provider'

export const SwapWidgetToken1Input = () => {
  const {
    state: { chainId, token1 },
    mutate: { setToken1 },
  } = useDerivedStateSwapWidget()

  const { isLoading, isFetching, data: quote } = useSwapWidgetTradeQuote()

  return (
    <Web3Input.Currency
      id="swap-to"
      type="OUTPUT"
      disabled
      className="p-4 bg-white dark:bg-slate-900 rounded-xl"
      value={quote?.amountOut?.toSignificant() ?? ''}
      chainId={chainId}
      onSelect={setToken1}
      currency={token1}
      loading={isLoading}
      fetching={isFetching}
      disableMaxButton
      allowNative={isWNativeSupported(chainId)}
      label="Buy"
    />
  )
}
