import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { CellProps } from './types'

export const AvailableForBorrowCell: FC<CellProps> = ({ row }) => {
  return (
    <Typography variant="sm" weight={500} className="truncate text-slate-50">
      {formatUSD(row.totalAssetUSD)}
    </Typography>
  )
}
