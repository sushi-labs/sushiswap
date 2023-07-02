import { formatUSD } from '@sushiswap/format'
import { FC } from 'react'
import { PositionWithPool } from 'types'

import { Row } from '../../SharedCells/types'

export const PairValueCell: FC<Row<PositionWithPool>> = ({ row }) => {
  const valueUSD = (Number(row.balance) / Number(row.pool.totalSupply)) * Number(row.pool.liquidityUSD)

  return <p className="text-sm font-semibold  text-right text-gray-900 dark:text-slate-50">{formatUSD(valueUSD)}</p>
}
