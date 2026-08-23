'use client'

import { classNames } from '@sushiswap/ui'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/currency'
import type { CurrencyInputProps } from 'src/lib/wagmi/components/web3-input/currency'
import type { BalanceChainId } from '~evm/_common/ui/balance-provider/types'

type XSwapCurrencyInputProps<
  TChainId extends BalanceChainId,
  TNetwork extends BalanceChainId = TChainId,
> = CurrencyInputProps<TChainId, TNetwork>

export function XSwapCurrencyInput<
  TChainId extends BalanceChainId,
  TNetwork extends BalanceChainId = TChainId,
>({ className, ...props }: XSwapCurrencyInputProps<TChainId, TNetwork>) {
  return (
    <CurrencyInput
      {...props}
      className={classNames(
        'border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl',
        className,
      )}
    />
  )
}
