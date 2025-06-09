'use client'

import { classNames } from '@sushiswap/ui'
import { usePathname } from 'next/navigation'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi/config'
import { useDerivedStateTwap } from './derivedstate-twap-provider'

export const TwapToken0Input = () => {
  const {
    state: { swapAmountString, chainId, token0 },
    mutate: { setSwapAmount, setToken0 },
    isToken0Loading: isLoading,
  } = useDerivedStateTwap()
  const pathname = usePathname()
  const isLimit = pathname.includes('limit')

  return (
    <Web3Input.Currency
      id="swap-from"
      type="INPUT"
      className={classNames(
        'border border-accent p-3 bg-gray-100 dark:bg-slate-900 rounded-xl',
      )}
      chainId={chainId}
      onSelect={setToken0}
      value={swapAmountString}
      onChange={setSwapAmount}
      currency={token0}
      currencyLoading={isLoading}
      allowNative={isWNativeSupported(chainId)}
      label="Sell"
      isLimit={isLimit}
    />
  )
}
