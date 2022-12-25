'use client'

import { CreditCardIcon } from '@heroicons/react/20/solid'
import { FundSource } from '@sushiswap/hooks'
import { Skeleton } from '@sushiswap/ui13/components/skeleton'
import React, { FC } from 'react'

import { useBalance } from '../../../hooks'
import { CurrencyInputProps } from './index'

type BalancePanel = Pick<
  CurrencyInputProps,
  'chainId' | 'onChange' | 'currency' | 'disableMaxButton' | 'fundSource' | 'loading'
> & {
  id?: string
  account: string | undefined
}

export const BalancePanel: FC<BalancePanel> = ({
  id,
  chainId,
  account,
  onChange,
  currency,
  disableMaxButton,
  fundSource = FundSource.WALLET,
  loading,
}) => {
  const { data: balance, isLoading } = useBalance({
    chainId,
    currency,
    account,
    enabled: Boolean(currency),
  })

  const [big, portion] = (balance ? `${balance?.[fundSource]?.toSignificant(6)}` : '0.00').split('.')

  if (isLoading || loading) {
    return (
      <div className="h-[24px] w-[60px] flex items-center">
        <Skeleton.Box className="bg-white/[0.06] h-[12px] w-full" />
      </div>
    )
  }

  return (
    <button
      data-testid={`${id}-balance-button`}
      type="button"
      onClick={() => onChange(balance?.[fundSource]?.greaterThan(0) ? balance[fundSource].toFixed() : '')}
      className="font-medium flex gap-1 items-center py-1 text-blue hover:text-blue-600 active:text-blue-700 dark:text-slate-400 hover:dark:text-slate-300 px-2 rounded-md"
      disabled={disableMaxButton}
    >
      <CreditCardIcon width={20} height={20} />
      <span className="text-lg">
        {big}.<span className="text-sm font-semibold">{portion ?? '00'}</span>
      </span>
    </button>
  )
}
