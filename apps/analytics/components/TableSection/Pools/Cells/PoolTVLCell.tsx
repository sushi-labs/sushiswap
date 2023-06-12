import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { Row } from '../../Common/types'

export const PoolTVLCell: FC<Row<{ liquidityUSD: string }>> = ({ row }) => {
  const tvl = formatUSD(row.liquidityUSD)

  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {tvl.includes('NaN') ? '$0.00' : tvl}
    </Typography>
  )
}
