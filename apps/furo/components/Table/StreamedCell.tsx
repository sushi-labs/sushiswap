import { Progress } from '@sushiswap/ui/components/progress'
import React, { FC } from 'react'

import { CellProps } from './types'

export const StreamedCell: FC<CellProps> = ({ row }) => {
  if (row.streamedPercentage?.toFixed() === '100.00') {
    return <span className="text-sm font-medium text-green">Completed</span>
  }

  if (row.isCancelled) {
    return <span className="text-sm font-medium">Cancelled</span>
  }

  return <Progress value={Number(row.streamedPercentage?.toSignificant(4))} />
}
