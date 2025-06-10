'use client'

import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi/config'
import { useDerivedStateFiat } from './derivedstate-fiat-provider'

export const FiatToken1Input = () => {
  const {
    state: { chainId, token1, swapAmountString },
    mutate: { setToken1 },
    isToken1Loading: isLoading,
  } = useDerivedStateFiat()

  return (
    <Web3Input.Currency
      id="swap-to"
      type="OUTPUT"
      disabled
      className="border border-accent p-3 bg-gray-100 dark:bg-slate-900 rounded-xl overflow-visible"
      value={swapAmountString}
      chainId={chainId}
      onSelect={setToken1}
      currency={token1}
      disableMaxButton
      currencyLoading={isLoading}
      allowNative={isWNativeSupported(chainId)}
      label="Buy"
      showQuickSelect={true}
    />
  )
}
