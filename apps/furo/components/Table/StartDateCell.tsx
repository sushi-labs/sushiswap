import { FC } from 'react'

import { CellProps } from './types'

export const StartDateCell: FC<CellProps> = ({ row }) => {
  return row.startTime.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
