import { formatUSD } from '@sushiswap/format'
import { FC } from 'react'

import { Row } from '../../Common/types'

export const PoolFees1wCell: FC<Row<{ fees1w: string | number }>> = ({ row }) => {
  const fees = formatUSD(row.fees1w)
  return <p className="text-sm font-semibold  text-right text-slate-50">{fees.includes('NaN') ? '$0.00' : fees}</p>
}
