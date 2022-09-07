import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { CellProps } from './types'

export const PairFees24hCell: FC<CellProps> = ({ row }) => {
  const volume = formatUSD(row.fees24h)

  return (
    <Typography variant="sm" weight={600} className="text-slate-50 text-right">
      {volume.includes('NaN') ? '$0.00' : volume}
    </Typography>
  )
}
