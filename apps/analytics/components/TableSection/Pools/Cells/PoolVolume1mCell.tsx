import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'
import { Row } from '../../Common/types'

export const PoolVolume1mCell: FC<Row<{ volume1m: string | number }>> = ({ row }) => {
  const volume = formatUSD(row.volume1m)

  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {volume.includes('NaN') ? '$0.00' : volume}
    </Typography>
  )
}
