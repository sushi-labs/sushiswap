import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { CellProps } from './types'

<<<<<<<< HEAD:apps/earn/components/PoolsSection/Tables/PoolsTable/Cells/PoolFees24hCell.tsx
export const PoolFees24hCell: FC<CellProps> = ({ row }) => {
========
export const PoolFees1dCell: FC<CellProps> = ({ row }) => {
>>>>>>>> origin/feature/add-incentive-integration-v2:apps/earn/components/PoolsSection/Tables/PoolsTable/Cells/PoolFees1dCell.tsx
  const fees = formatUSD(row.fees1d)

  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {fees.includes('NaN') ? '$0.00' : fees}
    </Typography>
  )
}
