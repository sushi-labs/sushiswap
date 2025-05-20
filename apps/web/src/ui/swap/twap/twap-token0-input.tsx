'use client'

import { classNames } from '@sushiswap/ui'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi/config'
import {
  useDerivedStateTwap,
  useTwapTradeErrors,
} from './derivedstate-twap-provider'

export const TwapToken0Input = () => {
  const {
    state: { swapAmountString, chainId, token0 },
    mutate: { setSwapAmount, setToken0 },
    isToken0Loading: isLoading,
  } = useDerivedStateTwap()

  const { minTradeSizeError } = useTwapTradeErrors()

  return (
    <Web3Input.Currency
      id="swap-from"
      type="INPUT"
      className={classNames(
        'border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl',
        minTradeSizeError ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
      )}
      chainId={chainId}
      onSelect={setToken0}
      value={swapAmountString}
      onChange={setSwapAmount}
      currency={token0}
      currencyLoading={isLoading}
      allowNative={isWNativeSupported(chainId)}
      label="You're selling"
    />
  )
}
