'use client'

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
      className="py-1 text-xs text-slate-400 hover:text-slate-300"
      disabled={disableMaxButton}
    >
      {balance ? `Balance: ${balance?.[fundSource]?.toSignificant(6)}` : 'Balance: 0'}
    </button>
  )
}
