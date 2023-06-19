import { formatPercent } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { FarmRewardsAvailableTooltip } from '../../../FarmRewardsAvailableTooltip'
import { Row } from '../../Common/types'

export const PoolAPRCell: FC<Row<{ totalApr1d: string | number; incentives: unknown[] }>> = ({ row }) => {
  return (
    <Typography variant="sm" weight={600} className="flex items-center justify-end gap-1 text-slate-50">
      {row?.incentives?.length > 0 && <FarmRewardsAvailableTooltip />}
      {formatPercent(row.totalApr1d)}
    </Typography>
  )
}
