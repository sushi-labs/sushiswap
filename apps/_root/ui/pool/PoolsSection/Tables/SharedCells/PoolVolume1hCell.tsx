import { formatUSD } from '@sushiswap/format'
import { FC } from 'react'

import { Row } from './types'

export const PoolVolume1hCell: FC<Row<{ volume1h: string | number; volumeChange1h: string | number }>> = ({ row }) => {
  const volume = formatUSD(row.volume1h)

  return (
    <span className="text-sm text-right text-gray-900 dark:text-slate-50">
      {volume.includes('NaN') ? '$0.00' : volume}
    </span>
  )
}
