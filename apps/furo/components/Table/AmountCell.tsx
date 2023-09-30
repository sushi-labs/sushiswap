import React, { FC } from 'react'

import { CellProps } from './types'

export const AmountCell: FC<CellProps> = ({ row }) => {
  return (
    <span className="flex flex-col">
      {row.totalAmount.greaterThan('0') ? row.totalAmount.toSignificant(6) : '< 0.01'}{' '}
      <span className="text-xs text-muted-foreground">{row.totalAmount.currency.symbol}</span>
    </span>
  )
}
