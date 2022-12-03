import { ProgressBar, ProgressColor, Typography } from '@sushiswap/ui'
import React, { FC } from 'react'

import { CellProps } from './types'

export const StreamedCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex gap-3">
      <ProgressBar
        showLabel={false}
        className="min-w-[100px] max-w-[100px] h-3"
        progress={Number(row.streamedPercentage?.divide(100).toSignificant(4))}
        color={ProgressColor.BLUE}
      />
      <Typography variant="sm" weight={500} className="text-slate-200">
        {row.streamedPercentage?.toPercentageString(2)}
      </Typography>
    </div>
  )
}
