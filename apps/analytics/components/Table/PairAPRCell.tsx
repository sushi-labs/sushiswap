import { formatPercent } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { CellProps } from './types'

export const PairAPRCell: FC<CellProps> = ({ row }) => {
  const apr = formatPercent(row.apr)

  return (
    <Typography variant="sm" weight={600} className="text-slate-50">
      {apr.includes('NaN') ? '$0.00' : apr}
    </Typography>
  )
}
