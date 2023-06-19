import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { Row } from '../../Common/types'

export const PoolVolume1dCell: FC<Row<{ volume1d: string | number }>> = ({ row }) => {
  const volume = formatUSD(row.volume1d)
  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {volume.includes('NaN') ? '$0.00' : volume}
    </Typography>
  )
}
