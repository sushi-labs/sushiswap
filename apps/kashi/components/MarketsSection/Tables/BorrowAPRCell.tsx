import { formatPercent } from '@sushiswap/format'
import { FC } from 'react'

import { CellProps } from './types'

export const BorrowAPRCell: FC<CellProps> = ({ row }) => {
  return (
    <>
      <div className="font-semibold">{formatPercent(row.kpi.borrowAPR / 1e18)}</div>
    </>
  )
}
