import { formatPercent } from '@sushiswap/format'
import { FC } from 'react'

import { Row } from '../../Common'

export const PoolAPRCell: FC<Row<{ totalApr1d: string | number; incentives: unknown[] }>> = ({ row }) => {
  return <>{formatPercent(row.totalApr1d)}</>
}
