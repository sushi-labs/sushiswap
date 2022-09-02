import { formatPercent } from '@sushiswap/format'
import { Tooltip, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { CellProps } from './types'

export const PairAPRCell: FC<CellProps> = ({ row }) => {
  const formattedApr = formatPercent(row.apr / 100)

  return (
    <Typography variant="sm" weight={600} className="flex items-center gap-1 text-slate-50">
      {formattedApr}
      <Tooltip
        placement="bottom"
        button={<div>✨</div>}
        panel={<div className="text-xs rounded-2xl text-slate-300">Farm rewards available</div>}
      />
    </Typography>
  )
}
