import { formatPercent } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { CellProps } from './types'

export const TotalBorrowCell: FC<CellProps> = ({ row }) => {
  return (
    <Typography variant="sm" weight={500} className="truncate text-slate-50">
      {formatPercent(row.utilization)}
    </Typography>
  )
}
