import { Pool } from '@sushiswap/client'
import { formatPercent } from '@sushiswap/format'
import { FC } from 'react'

import { Row } from './types'

export const PoolAPRCell: FC<Row<{ totalApr1d: number; incentives: Pool['incentives'] }>> = ({ row }) => {
  return (
    <span className="flex items-center justify-end gap-1 text-sm text-gray-900 dark:text-slate-50">
      {formatPercent(row.totalApr1d)}
    </span>
  )
}
