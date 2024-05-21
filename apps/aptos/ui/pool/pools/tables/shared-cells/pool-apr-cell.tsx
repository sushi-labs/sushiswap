import { PoolExtended } from 'lib/pool/use-pools-extended'
import React, { FC } from 'react'
import { formatPercent } from 'sushi/format'
import { Row } from './types'

export const PoolAprCell: FC<Row<PoolExtended>> = () => {
  return <div className="flex items-center gap-1">{formatPercent(0)}</div>
}
