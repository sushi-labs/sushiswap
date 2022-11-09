import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { TransactionCellProps } from './types'

export const TransactionHashCell: FC<TransactionCellProps> = ({ row }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col">
        <Typography variant="sm" weight={500} className="flex items-center gap-1 text-slate-50">
          {row.txHash}
        </Typography>
      </div>
    </div>
  )
}
