import { Typography } from '@sushiswap/ui'
import { FC } from 'react'
import { formatNumber } from '@sushiswap/format'

import { CellProps } from './types'

export const BurnAmount0Cell: FC<CellProps> = ({ row }) => {
  return (
    <Typography variant="sm" weight={500} className="text-slate-50">
      {row.amount0? formatNumber(row.amount0): "0.00" + " "}{row.pair.token0.symbol}
    </Typography>
  )
}
