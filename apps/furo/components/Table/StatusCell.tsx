import { Chip } from '@sushiswap/ui'
import React, { FC } from 'react'

import { FuroStatus } from '../../lib'
import { CellProps } from './types'

export const StatusCell: FC<CellProps> = ({ row }) => {
  return (
    <Chip
      className="capitalize"
      label={row.status === FuroStatus.EXTENDED ? 'Active' : row.status.toLowerCase()}
      color={
        row.status === FuroStatus.CANCELLED
          ? 'red'
          : row.status === FuroStatus.COMPLETED
          ? 'green'
          : row.status === FuroStatus.ACTIVE
          ? 'blue'
          : row.status === FuroStatus.UPCOMING
          ? 'yellow'
          : row.status === FuroStatus.EXTENDED
          ? 'green'
          : 'default'
      }
    />
  )
}
