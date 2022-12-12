import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { CellProps } from './types'

export const BurnAmountUSDCell: FC<CellProps> = ({ row }) => {
  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {row.amountUSD? formatUSD(row.amountUSD) : '$0.00'}
    </Typography>
  )
}
