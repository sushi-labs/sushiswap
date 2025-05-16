'use client'

import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi/config'
import { useDerivedStateTwap, useTwapTrade } from './derivedstate-twap-provider'

export const TwapToken1Input = () => {
  const {
    state: { chainId, token1 },
    mutate: { setToken1 },
    isToken1Loading: isLoading,
  } = useDerivedStateTwap()

  const trade = useTwapTrade()

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
      disableMaxButton
      currencyLoading={isLoading}
      allowNative={isWNativeSupported(chainId)}
      label="You're buying"
    />
  )
}
