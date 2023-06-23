import { formatUSD } from '@sushiswap/format'
import { FC, useMemo } from 'react'

import { ConcentratedLiquidityPositionWithV3Pool } from '@sushiswap/wagmi/future/hooks'
import { Row } from '../../SharedCells/types'

export const UnclaimedCell: FC<Row<ConcentratedLiquidityPositionWithV3Pool>> = ({ row }) => {
  return (
    <span className="flex items-center justify-end gap-1 text-sm text-gray-900 dark:text-slate-50">
      {formatUSD(row.position.unclaimedUSD)}
    </span>
  )
}
