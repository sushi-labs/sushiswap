import { formatUSD } from '@sushiswap/format'
import { FC } from 'react'

import { Row } from '../../Common/types'

export const PoolVolume1wCell: FC<Row<{ volume1w: string | number }>> = ({ row }) => {
  const volume = formatUSD(row.volume1w)

  return <p className="text-sm font-semibold  text-right text-slate-50">{volume.includes('NaN') ? '$0.00' : volume}</p>
}
