import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { TransactionCellProps } from './types'

export const TransactionAmountCell: FC<TransactionCellProps> = ({ row }) => {
  return (
    <Typography variant="sm" weight={500} className="text-slate-50">
      { row.amount / 1000000000000 > 1 ? (row.amount / 1000000000000).toFixed(1) + "t" : 
        row.amount / 1000000000 > 1 ? (row.amount / 1000000000).toFixed(1) + "b" :
        row.amount / 1000000 > 1 ? (row.amount / 1000000).toFixed(1) + "m" :
        row.amount / 1000 > 1 ? (row.amount / 1000).toFixed(1) + "k" :
        row.amount}<span className="text-slate-500"> </span>{row.token.symbol}
    </Typography>
  )
}
