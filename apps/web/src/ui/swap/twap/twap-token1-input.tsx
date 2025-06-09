'use client'

import { usePathname } from 'next/navigation'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi/config'
import { useDerivedStateTwap } from './derivedstate-twap-provider'

export const TwapToken1Input = () => {
  const {
    state: { chainId, token1, amountOut },
    mutate: { setToken1 },
    isToken1Loading: isLoading,
  } = useDerivedStateTwap()
  const pathname = usePathname()
  const isLimit = pathname.includes('limit')

  return (
    <Web3Input.Currency
      id="swap-to"
      type="OUTPUT"
      disabled
      className="border border-accent p-3 bg-gray-100 dark:bg-slate-900 rounded-xl"
      value={amountOut?.toSignificant() ?? ''}
      chainId={chainId}
      onSelect={setToken1}
      currency={token1}
      disableMaxButton
      currencyLoading={isLoading}
      allowNative={isWNativeSupported(chainId)}
      label="Buy"
      showQuickSelect={true}
      isLimit={isLimit}
    />
  )
}
