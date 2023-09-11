import { FC } from 'react'

import { CellProps } from './types'

export const TypeCell: FC<CellProps> = ({ row }) => {
  return row.type
}
