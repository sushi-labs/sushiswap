'use client'

import { classNames } from '@sushiswap/ui'
import { useTradeMode } from 'src/lib/hooks/useTradeMode'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi/config'
import { useDerivedStateTwap } from './derivedstate-twap-provider'

export const TwapToken0Input = () => {
  const {
    state: { swapAmountString, chainId, token0 },
    mutate: { setSwapAmount, setToken0 },
    isToken0Loading: isLoading,
  } = useDerivedStateTwap()
  const { tradeMode } = useTradeMode()
  const isTwap = tradeMode === 'limit' || tradeMode === 'dca'

  return (
    <Web3Input.Currency
      id="swap-from"
      type="INPUT"
      className={classNames(
        'border border-white/10 dark:border-black/10 p-3 bg-gray-100 dark:bg-slate-900 rounded-xl',
      )}
      chainId={chainId}
      onSelect={setToken0}
      value={swapAmountString}
      onChange={setSwapAmount}
      currency={token0}
      currencyLoading={isLoading}
      allowNative={isWNativeSupported(chainId)}
      label={tradeMode === 'limit' ? 'Sell' : 'Allocate'}
      isTwap={isTwap}
    />
  )
}
