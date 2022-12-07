import { Typography } from '@sushiswap/ui'
import { FC } from 'react'
import { formatNumber } from '@sushiswap/format'

import { CellProps } from './types'

export const BurnAmount1Cell: FC<CellProps> = ({ row }) => {
  return (
    <Typography variant="sm" weight={500} className="text-slate-50">
      {row.amount1? formatNumber(row.amount1) : "0.00" + " "}{row.pair.token1.symbol}
    </Typography>
  )
}
