import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'
import { PositionWithPool } from '../../../../../types'

import { Row } from '../../SharedCells/types'

export const PairValueCell: FC<Row<PositionWithPool>> = ({ row }) => {
  const valueUSD = (Number(row.balance) / Number(row.pool.totalSupply)) * Number(row.pool.liquidityUSD)

  return (
    <Typography variant="sm" weight={600} className="text-right text-gray-900 dark:text-slate-50">
      {formatUSD(valueUSD)}
    </Typography>
  )
}
