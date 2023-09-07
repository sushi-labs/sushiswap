import { formatUSD } from '@sushiswap/format'
import { FC } from 'react'

import { Row } from '../../Common'

export const PoolTVLCell: FC<Row<{ liquidityUSD: string }>> = ({ row }) => {
  const tvl = formatUSD(row.liquidityUSD)

  return <>{tvl.includes('NaN') ? '$0.00' : tvl}</>
}
