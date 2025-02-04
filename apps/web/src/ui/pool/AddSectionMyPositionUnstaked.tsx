import { Currency } from '@sushiswap/ui'
import React, { type FC } from 'react'
import { formatUSD } from 'sushi/format'

import { usePoolPosition } from './PoolPositionProvider'

export const AddSectionMyPositionUnstaked: FC = () => {
  const {
    balance,
    value0,
    value1,
    underlying1,
    underlying0,
    isError,
    isLoading,
  } = usePoolPosition()

  if (isLoading && !isError && !balance) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 justify-between items-center">
          <p className="text-sm font-semibold  dark:text-slate-50 text-gray-900">
            My Liquidity Position
          </p>
          <div className="h-[16px] w-[40px] animate-pulse bg-slate-600 rounded-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center gap-1.5">
            <div className="h-[16px] w-[120px] bg-slate-700 animate-pulse rounded-full" />
            <div className="h-[16px] w-[40px] bg-slate-700 animate-pulse rounded-full" />
          </div>
          <div className="flex justify-between items-center gap-1.5">
            <div className="h-[16px] w-[120px] bg-slate-700 animate-pulse rounded-full" />
            <div className="h-[16px] w-[40px] bg-slate-700 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 justify-between items-center">
        <p className="text-sm font-semibold  dark:text-slate-50 text-gray-900">
          My Liquidity Position
        </p>
        <p className="text-xs font-medium dark:text-slate-400 text-gray-600">
          {formatUSD(value0 + value1)}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4">
            {underlying0 && (
              <Currency.Icon
                currency={underlying0.currency}
                width={16}
                height={16}
              />
            )}
          </div>
          <p className="text-xs font-medium flex items-center gap-1 dark:text-slate-400 text-gray-600">
            {balance && underlying0?.toSignificant(3)}{' '}
            {underlying0?.currency.symbol}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4">
            {underlying1 && (
              <Currency.Icon
                currency={underlying1.currency}
                width={16}
                height={16}
              />
            )}
          </div>
          <p className="text-xs font-medium flex items-center gap-1 dark:text-slate-400 text-gray-600">
            {balance && underlying1?.toSignificant(3)}{' '}
            {underlying1?.currency.symbol}
          </p>
        </div>
      </div>
    </div>
  )
}
