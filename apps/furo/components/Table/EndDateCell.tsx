import { FC } from 'react'

import { CellProps } from './types'

export const EndDateCell: FC<CellProps> = ({ row }) => {
  return row.endTime.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
