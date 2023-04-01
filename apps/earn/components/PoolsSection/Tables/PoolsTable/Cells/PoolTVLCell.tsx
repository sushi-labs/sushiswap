import { formatUSD } from '@sushiswap/format'
import { FC } from 'react'

import { CellProps } from './types'

export const PoolTVLCell: FC<CellProps> = ({ row }) => {
  const tvl = formatUSD(row.liquidityUSD)
  return (
    <span className="text-sm text-right text-gray-900 dark:text-slate-50">{tvl.includes('NaN') ? '$0.00' : tvl}</span>
  )
}
