import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { TransactionCellProps } from './types'

export const TransactionBlockCell: FC<TransactionCellProps> = ({ row }) => {
  return (
    <Typography variant="sm" weight={500} className="text-slate-50">
      {row.createdAtBlock}
    </Typography>
  )
}
