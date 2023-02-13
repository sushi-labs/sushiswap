import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { Row } from './types'

<<<<<<<< HEAD:apps/earn/components/PoolsSection/Tables/SharedCells/PoolVolume24hCell.tsx
export const PoolVolume24hCell: FC<Row<{ volume1d: string | number }>> = ({ row }) => {
========
export const PoolVolume1dCell: FC<Row<{ volume1d: string | number }>> = ({ row }) => {
>>>>>>>> origin/feature/add-incentive-integration-v2:apps/earn/components/PoolsSection/Tables/SharedCells/PoolVolume1dCell.tsx
  const volume = formatUSD(row.volume1d)

  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {volume.includes('NaN') ? '$0.00' : volume}
    </Typography>
  )
}
