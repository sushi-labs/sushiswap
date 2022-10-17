import { Percent } from '@sushiswap/math'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { CellProps } from './types'

export const BorrowAPRCell: FC<CellProps> = ({ row }) => {
  return (
    <Typography variant="sm" weight={500} className="text-slate-50">
      {new Percent(row.currentInterestPerYear, 1e18).toSignificant(6)}
    </Typography>
  )
}
