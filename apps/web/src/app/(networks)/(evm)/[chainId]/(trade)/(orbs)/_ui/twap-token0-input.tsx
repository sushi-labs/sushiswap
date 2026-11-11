'use client'

import { InputErrors, useInputErrors } from '@orbs-network/spot-react'
import { classNames } from '@sushiswap/ui'
import { SwapInputLabel } from 'src/app/(networks)/(evm)/[chainId]/(trade)/_ui/swap-input-label'
import type { SupportedChainId } from 'src/config'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/currency'
import { type EvmChainId, isEvmWNativeSupported } from 'sushi/evm'
import { useDerivedStateSimpleSwap } from '../../swap/_ui/derivedstate-simple-swap-provider'

export const TwapToken0Input = () => {
  const {
    state: { swapAmountString, chainId, token0 },
    mutate: { setSwapAmount, setToken0 },
    isToken0Loading: isLoading,
  } = useDerivedStateSimpleSwap<SupportedChainId & EvmChainId>()

  const minTradeSizeError =
    useInputErrors()?.type === InputErrors.MIN_TRADE_SIZE

  return (
    <CurrencyInput
      id="swap-from"
      type="INPUT"
      className={classNames(
        'border border-accent p-4 bg-muted rounded-2xl',
        minTradeSizeError ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
      )}
      chainId={chainId}
      onSelect={setToken0}
      value={swapAmountString}
      onChange={setSwapAmount}
      currency={token0}
      currencyLoading={isLoading}
      allowNative={isEvmWNativeSupported(chainId)}
      label={<SwapInputLabel chainId={chainId} type="INPUT" />}
    />
  )
}
