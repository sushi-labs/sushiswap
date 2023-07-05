import { Chip } from '@sushiswap/ui/components/chip'
import React, { FC } from 'react'

import { FuroStatus } from '../../lib'
import { CellProps } from './types'

export const StatusCell: FC<CellProps> = ({ row }) => {
  return (
    <Chip variant={[FuroStatus.CANCELLED, FuroStatus.COMPLETED].includes(row.status) ? 'ghost' : 'default'}>
      {row.status === FuroStatus.EXTENDED ? 'Active' : row.status.toLowerCase()}
    </Chip>
  )
}
