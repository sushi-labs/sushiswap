import React, { FC } from 'react'
import { formatPercent } from 'sushi/format'
import { Pool } from 'utils/usePools'
import { Row } from './types'

export const PoolAprCell: FC<Row<Pool>> = () => {
  return <div className="flex items-center gap-1">{formatPercent(0)}</div>
}
