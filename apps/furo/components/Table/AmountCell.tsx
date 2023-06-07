import React, { FC } from 'react'

import { CellProps } from './types'

export const AmountCell: FC<CellProps> = ({ row }) => {
  return (
    <span className="flex flex-col font-semibold text-sm text-gray-900 dark:text-slate-200">
      {row.totalAmount.greaterThan('0') ? row.totalAmount.toSignificant(6) : '< 0.01'}{' '}
      <span className="text-xs text-gray-500 dark:text-gray-400">{row.totalAmount.currency.symbol}</span>
    </span>
  )
}
