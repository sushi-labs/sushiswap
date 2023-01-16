import { Typography } from '@sushiswap/ui'
import React, { FC } from 'react'

import { CellProps } from './types'

export const AmountCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex flex-col w-full">
      <Typography variant="sm" weight={500} className="text-right text-slate-200">
        {row.totalAmount.greaterThan('0') ? row.totalAmount.toSignificant(6) : '< 0.01'}{' '}
        <span className="font-medium text-slate-500">{row.token.symbol}</span>
      </Typography>
    </div>
  )
}
