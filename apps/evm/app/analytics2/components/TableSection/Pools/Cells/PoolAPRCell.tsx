import { formatPercent } from '@sushiswap/format'
import { FC } from 'react'

import { FarmRewardsAvailableTooltip } from '../../../FarmRewardsAvailableTooltip'
import { Row } from '../../Common/types'

export const PoolAPRCell: FC<Row<{ totalApr1d: string | number; incentives: unknown[] }>> = ({ row }) => {
  return (
    <p className="text-sm font-semibold  flex items-center justify-end gap-1 text-slate-50">
      {row?.incentives?.length > 0 && <FarmRewardsAvailableTooltip />}
      {formatPercent(row.totalApr1d)}
    </p>
  )
}
