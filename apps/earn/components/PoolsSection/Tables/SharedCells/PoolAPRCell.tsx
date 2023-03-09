import { formatPercent } from '@sushiswap/format'
import { Pool } from '@sushiswap/client'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { FarmRewardsAvailableTooltip } from '../../../FarmRewardsAvailableTooltip'
import { Row } from './types'

export const PoolAPRCell: FC<Row<{ totalApr: number; incentives: Pool['incentives'] }>> = ({ row }) => {
  return (
    <Typography variant="sm" weight={600} className="flex items-center justify-end gap-1 text-slate-50">
      {!!row.incentives && row.incentives.length > 0 && <FarmRewardsAvailableTooltip />}
      {formatPercent(row.totalApr)}
    </Typography>
  )
}
