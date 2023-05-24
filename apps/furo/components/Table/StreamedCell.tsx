import { ProgressBar, ProgressColor } from '@sushiswap/ui'
import React, { FC } from 'react'

import { CellProps } from './types'

export const StreamedCell: FC<CellProps> = ({ row }) => {
  return (
    <ProgressBar
      showLabel={false}
      className="min-w-[100px] max-w-[100px] h-3"
      progress={Number(row.streamedPercentage?.divide(100).toSignificant(4))}
      color={row.isCancelled ? ProgressColor.GRAY : row.isEnded ? ProgressColor.GREEN : ProgressColor.BLUE}
    />
  )
}
