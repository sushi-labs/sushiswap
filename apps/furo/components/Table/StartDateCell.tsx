import React, { FC } from 'react'

import { CellProps } from './types'

export const StartDateCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex flex-col gap-0.5 justify-end">
      <span className="text-sm whitespace-nowrap text-right">
        {row.startTime.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        })}
      </span>
    </div>
  )
}
