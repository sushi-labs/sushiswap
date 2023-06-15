import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { Row } from '../../Common/types'
import { Token } from '@sushiswap/graph-client'

export const TokenVolumeCell: FC<Row<Token>> = ({ row }) => {
  const volume = formatUSD(row.volumeUSD)

  return (
    <Typography variant="sm" weight={600} className="text-slate-50 text-right">
      {volume.includes('NaN') ? '$0.00' : volume}
    </Typography>
  )
}
