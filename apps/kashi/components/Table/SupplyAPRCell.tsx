import { Typography } from '@sushiswap/ui'
import { useSupplyAPR } from 'lib/hooks'
import { FC } from 'react'

import { CellProps } from './types'

export const SupplyAPRCell: FC<CellProps> = ({ row }) => {
  const apr = useSupplyAPR(row)
  return (
    <Typography variant="sm" weight={500} className="text-slate-50">
      {/* Initial APR is 1%, or min of interestPerYear or 0.25% */}
      {apr}
    </Typography>
  )
}
