import React, { FC } from 'react'
import { Row } from './types'
import { Pool } from 'utils/usePools'
import { formatPercent } from '@sushiswap/format'

export const PoolAprCell: FC<Row<Pool>> = ({ row }) => {
  return <div className="flex items-center gap-1">{formatPercent(0)}</div>
}
