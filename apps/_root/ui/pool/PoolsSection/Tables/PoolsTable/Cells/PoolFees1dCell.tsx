import { formatUSD } from '@sushiswap/format'
import { FC } from 'react'

import { CellProps } from './types'

export const PoolFees1dCell: FC<CellProps> = ({ row }) => {
  const fees = formatUSD(row.fees1d)

  return (
    <span className="text-sm text-right text-gray-900 dark:text-slate-50">{fees.includes('NaN') ? '$0.00' : fees}</span>
  )
}
