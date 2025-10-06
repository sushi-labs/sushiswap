'use client'

import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi/evm'
import { useDerivedStateSwapWidget } from './derivedstate-swap-widget-provider'

export const SwapWidgetToken0Input = () => {
  const {
    state: { swapAmountString, chainId, token0 },
    mutate: { setSwapAmount, setToken0 },
  } = useDerivedStateSwapWidget()

  return (
    <Web3Input.Currency
      id="swap-from"
      type="INPUT"
      className="p-4 bg-white dark:bg-slate-900 rounded-xl"
      chainId={chainId}
      onSelect={setToken0}
      value={swapAmountString}
      onChange={setSwapAmount}
      currency={token0}
      allowNative={isWNativeSupported(chainId)}
      label="Sell"
    />
  )
}
