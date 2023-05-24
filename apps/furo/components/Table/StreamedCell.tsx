import { ProgressBar, ProgressColor } from '@sushiswap/ui'
import React, { FC } from 'react'

import { CellProps } from './types'

export const StreamedCell: FC<CellProps> = ({ row }) => {
  if (row.streamedPercentage?.toFixed() === '100.00') {
    return <span className="text-sm font-medium text-green">Completed</span>
  }

  if (row.isCancelled) {
    return <span className="text-sm font-medium">Cancelled</span>
  }

  return (
    <ProgressBar
      showLabel={true}
      className="w-full !h-5"
      progress={Number(row.streamedPercentage?.divide(100).toSignificant(4))}
      color={ProgressColor.BLUE}
    />
  )
}
