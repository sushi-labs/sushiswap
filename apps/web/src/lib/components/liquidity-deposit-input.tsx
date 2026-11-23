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
        <div className="bg-muted absolute inset-0 z-[1] rounded-xl flex flex-col items-center justify-center gap-2 px-6 text-sm font-medium text-center text-muted-foreground">
          <LockClosedIcon width={24} height={24} aria-hidden="true" />
          <span>
            Single-asset deposit only. {props.currency?.symbol} is not needed
            for this price range.{' '}
            <a
              href="https://www.sushi.com/academy"
              target="_blank"
              rel="noreferrer"
              className="text-pink hover:text-pink-600"
            >
              Learn More
            </a>
          </span>
        </div>
      )}
      <CurrencyInput
        {...props}
        type="INPUT"
        className="border border-accent p-4 bg-muted rounded-2xl"
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
      <div className="p-1 bg-secondary border border-accent rounded-full">
        <PlusIcon width={16} height={16} className="text-muted-foreground" />
      </div>
    </div>
  )
}
