import React, { FC } from 'react'

import { CellProps } from './types'

export const TypeCell: FC<CellProps> = ({ row }) => {
  return <div className="w-full text-left">{row.type}</div>
}
