import { formatUSD } from '@sushiswap/format'
import { FC } from 'react'

import { Row } from '../../Common/types'

export const PoolVolume1dCell: FC<Row<{ volume1d: string | number }>> = ({ row }) => {
  const volume = formatUSD(row.volume1d)
  return <>{volume.includes('NaN') ? '$0.00' : volume}</>
}
