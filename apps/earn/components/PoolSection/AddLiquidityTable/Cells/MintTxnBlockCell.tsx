import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { CellProps } from './types'

export const MintTxnBlockCell: FC<CellProps> = ({ row }) => {
  return (
    <Typography variant="sm" weight={500} className="text-slate-50">
      {row.transaction.createdAtBlock}
    </Typography>
  )
}
