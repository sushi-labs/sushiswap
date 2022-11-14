import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { TransactionCellProps } from './types'

export const TransactionToCell: FC<TransactionCellProps> = ({ row }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col">
        <Typography variant="sm" weight={500} className="flex items-center gap-1 text-slate-50">
          {row.to.id}
        </Typography>
      </div>
    </div>
  )
}
