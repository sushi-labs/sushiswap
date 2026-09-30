'use client'

import { LockClosedIcon, PlusIcon } from '@heroicons/react-v1/solid'
import type { ReactElement } from 'react'
import {
  CurrencyInput,
  type CurrencyInputProps,
} from 'src/lib/wagmi/components/web3-input/currency'
import type { BalanceChainId } from '~evm/_common/ui/balance-provider/types'

type LiquidityDepositInputProps<TChainId extends BalanceChainId> = Omit<
  CurrencyInputProps<TChainId>,
  'type' | 'className'
> & { locked?: boolean }

export function LiquidityDepositInput<TChainId extends BalanceChainId>({
  locked = false,
  ...props
}: LiquidityDepositInputProps<TChainId>): ReactElement {
  return (
    <div className="relative">
      {locked && (
        <div className="bg-gray-200 dark:bg-slate-800 absolute inset-0 z-[1] rounded-xl flex flex-col items-center justify-center gap-2 px-6 text-sm font-medium text-center text-slate-600 dark:text-slate-400">
          <LockClosedIcon width={24} height={24} aria-hidden="true" />
          <span>
            Single-asset deposit only. {props.currency?.symbol} is not needed
            for this price range.{' '}
            <a
              href="https://www.sushi.com/academy"
              target="_blank"
              rel="noreferrer"
              className="text-blue hover:text-blue-600"
            >
              Learn More
            </a>
          </span>
        </div>
      )}
      <CurrencyInput
        {...props}
        type="INPUT"
        className="rounded-xl border border-accent bg-white p-3 dark:bg-secondary"
        disabled={locked || props.disabled}
        disableMaxButton={locked || props.disableMaxButton}
      />
    </div>
  )
}

export function LiquidityDepositDivider(): ReactElement {
  return (
    <div
      className="flex items-center justify-center -my-6 z-10"
      aria-hidden="true"
    >
      <div className="p-1 bg-white dark:bg-slate-900 border border-accent rounded-full">
        <PlusIcon width={16} height={16} className="text-muted-foreground" />
      </div>
    </div>
  )
}
