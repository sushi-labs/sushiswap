import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { YieldIndicator } from '../YieldIndicator'
import { CellProps } from './types'

export const TotalAPRCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex flex-col gap-1.5 h-[40px]">
      <Typography variant="sm" weight={500} className="text-slate-50">
        {row.currentSupplyAPR.toSignificant(2)}%
      </Typography>
      <YieldIndicator percentage={row.currentSupplyAPR} />
    </div>
  )
}
