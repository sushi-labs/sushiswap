import { formatPercent } from '@sushiswap/format'
import { Percent } from '@sushiswap/math'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { YieldIndicator } from '../YieldIndicator'
import { CellProps } from './types'

export const TotalAPRCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex flex-col gap-1.5 h-[40px]">
      <Typography variant="sm" weight={500} className="text-slate-50">
        {formatPercent(row.supplyAPR / 1e18)}
      </Typography>
      {/*TODO*/}
      <YieldIndicator percentage={new Percent(2, 4)} />
    </div>
  )
}
