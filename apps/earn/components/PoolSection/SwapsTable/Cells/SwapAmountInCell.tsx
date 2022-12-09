import { Typography } from '@sushiswap/ui'
import { FC } from 'react'
import { formatNumber } from '@sushiswap/format'

import { CellProps } from './types'

export const SwapAmountInCell: FC<CellProps> = ({ row }) => {
  return (
    <Typography variant="sm" weight={500} className="text-slate-50">
      {formatNumber(row.amountIn) + " "}{row.tokenIn.symbol}
    </Typography>
  )
}
