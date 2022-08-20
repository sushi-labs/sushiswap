import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { CellProps } from './types'

export const PairVolume24hCell: FC<CellProps> = ({ row }) => {
  const volume = formatUSD(row.volume24h)

  return (
    <Typography variant="sm" weight={600} className="text-slate-50">
      {volume.includes('NaN') ? '$0.00' : volume}
    </Typography>
  )
}
