import { formatUSD } from '@sushiswap/format'
import { FC } from 'react'

import { Row } from '../../Common/types'

export const PoolTVLCell: FC<Row<{ liquidityUSD: string }>> = ({ row }) => {
  const tvl = formatUSD(row.liquidityUSD)

  return <p className="text-sm font-semibold  text-right text-slate-50">{tvl.includes('NaN') ? '$0.00' : tvl}</p>
}
