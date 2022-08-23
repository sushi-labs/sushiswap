import { formatPercent } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { FarmRewardsAvailableTooltip } from '../../FarmRewardsAvailableTooltip'
import { CellProps } from './types'

export const PairAPRCell: FC<CellProps> = ({ row }) => {
  const rewardAPR = row.incentives.reduce((acc, cur) => acc + (cur.apr || 0), 0) || 0
  const totalAPR = rewardAPR / 100 + row.apr / 100

  return (
    <Typography variant="sm" weight={600} className="flex items-center gap-1 text-slate-50">
      {formatPercent(totalAPR)}
      {row.incentives.length > 0 && <FarmRewardsAvailableTooltip />}
    </Typography>
  )
}
