'use client'

import { classNames } from '@sushiswap/ui'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { EvmChainId, isEvmWNativeSupported } from 'sushi/evm'
import { useDerivedStateSimpleSwap } from '../../swap/_ui/derivedstate-simple-swap-provider'
import { InputErrors, useInputErrors } from '@orbs-network/spot-react'

export const TwapToken0Input = () => {
  const {
    state: { swapAmountString, chainId, token0, swapAmount },
    mutate: { setSwapAmount, setToken0 },
    isToken0Loading: isLoading,
  } = useDerivedStateSimpleSwap()

  const minTradeSizeError =
    useInputErrors()?.type === InputErrors.MIN_TRADE_SIZE

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
      allowNative={isEvmWNativeSupported(chainId as EvmChainId)}
      label="You're selling"
    />
  )
}
