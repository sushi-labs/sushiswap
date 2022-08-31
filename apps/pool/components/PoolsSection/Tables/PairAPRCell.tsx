import { formatPercent } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { FarmRewardsAvailableTooltip } from '../../FarmRewardsAvailableTooltip'
import { CellProps } from './types'

export const PairAPRCell: FC<CellProps> = ({ row }) => {
  const rewardAPR = (row.incentives.reduce((acc, cur) => acc + (cur.apr || 0), 0) || 0) / 100
  const totalAPR = rewardAPR + row.apr / 100

  return (
    <Typography variant="sm" weight={600} className="flex items-center gap-1 text-slate-50 justify-end">
      {row.incentives.length > 0 && <FarmRewardsAvailableTooltip />}
      {formatPercent(totalAPR)}
    </Typography>
  )
}
