import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { CellProps } from './types'

export const PairTVLCell: FC<CellProps> = ({ row }) => {
  const tvl = formatUSD(row.liquidityUSD)

  return (
    <Typography variant="sm" weight={600} className="text-slate-50 text-right">
      {tvl.includes('NaN') ? '$0.00' : tvl}
    </Typography>
  )
}
