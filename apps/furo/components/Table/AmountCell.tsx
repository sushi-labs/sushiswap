import { Typography } from '@sushiswap/ui'
import React, { FC } from 'react'

import { CellProps } from './types'

export const AmountCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex flex-col w-full">
      <span className="font-semibold text-base text-gray-900 dark:text-slate-200">
        {row.totalAmount.greaterThan('0') ? row.totalAmount.toSignificant(6) : '< 0.01'}{' '}
        <span className="text-xs text-gray-500 dark:text-gray-400">{row.totalAmount.currency.symbol}</span>
      </span>
    </div>
  )
}
