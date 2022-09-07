import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { TokenCellProps } from './types'

export const TokenVolumeCell: FC<TokenCellProps> = ({ row }) => {
  const volume = formatUSD(row.volumeUSD)

  return (
    <Typography variant="sm" weight={600} className="text-slate-50 text-right">
      {volume.includes('NaN') ? '$0.00' : volume}
    </Typography>
  )
}
