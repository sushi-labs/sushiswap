import { formatPercent } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { CellProps } from './types'

export const BorrowAPRCell: FC<CellProps> = ({ row }) => {
  return (
    <Typography variant="sm" weight={500} className="text-slate-50">
      {formatPercent(row.borrowAPR / 1e18)}
    </Typography>
  )
}
