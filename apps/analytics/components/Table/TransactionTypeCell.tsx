import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { TransactionCellProps } from './types'

export const TransactionTypeCell: FC<TransactionCellProps> = ({ row }) => {
  return (
    <Typography weight={500} className="text-slate-50 w-fit">
      {row.type}
    </Typography>
  )
}
