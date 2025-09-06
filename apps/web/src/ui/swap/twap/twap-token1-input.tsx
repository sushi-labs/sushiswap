'use client'

import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi/evm'
import { useDerivedStateTwap } from './derivedstate-twap-provider'

export const TwapToken1Input = () => {
  const {
    state: { chainId, token1, amountOut },
    mutate: { setToken1 },
    isToken1Loading: isLoading,
  } = useDerivedStateTwap()

  return (
    <Web3Input.Currency
      id="swap-to"
      type="OUTPUT"
      disabled
      className="border border-white/10 dark:border-black/10 p-3 bg-gray-100 dark:bg-slate-900 rounded-xl overflow-visible"
      value={amountOut?.toSignificant() ?? ''}
      chainId={chainId}
      onSelect={setToken1}
      currency={token1}
      disableMaxButton
      currencyLoading={isLoading}
      allowNative={isWNativeSupported(chainId)}
      label="Buy"
      showQuickSelect={true}
      isTwap={true}
      selectedNetwork={chainId}
    />
  )
}
