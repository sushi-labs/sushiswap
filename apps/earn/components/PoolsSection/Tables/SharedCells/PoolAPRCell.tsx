import { formatPercent } from '@sushiswap/format'
import { Pool } from '@sushiswap/client'
import { FC } from 'react'

import { FarmRewardsAvailableTooltip } from '../../../FarmRewardsAvailableTooltip'
import { Row } from './types'

export const PoolAPRCell: FC<Row<{ totalApr: number; incentives: Pool['incentives'] }>> = ({ row }) => {
  return (
    <span className="text-sm flex items-center justify-end gap-1 text-gray-900 dark:text-slate-50">
      {!!row.incentives && row.incentives.length > 0 && <FarmRewardsAvailableTooltip />}
      {formatPercent(row.totalApr)}
    </span>
  )
}
