'use client'

import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi/config'
import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'

export const SimpleSwapToken0Input = () => {
  const {
    state: { swapAmountString, chainId0: chainId, token0 },
    mutate: { setSwapAmount, setToken0 },
    isToken0Loading: isLoading,
  } = useDerivedStateSimpleSwap()

  return (
    <Web3Input.Currency
      id="swap-from"
      type="INPUT"
      className="p-4 bg-gray-100 dark:bg-slate-900 rounded-xl"
      chainId={chainId}
      onSelect={setToken0}
      value={swapAmountString}
      onChange={setSwapAmount}
      currency={token0}
      loading={isLoading}
      currencyLoading={isLoading}
      allowNative={isWNativeSupported(chainId)}
      hidePercentageInputs={true}
      label="Sell"
    />
  )
}
