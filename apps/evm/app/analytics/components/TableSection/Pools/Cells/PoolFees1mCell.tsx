import { formatUSD } from '@sushiswap/format'
import { FC } from 'react'

import { Row } from '../../Common'

export const PoolFees1mCell: FC<Row<{ fees1m: string | number }>> = ({ row }) => {
  const fees = formatUSD(row.fees1m)
  return <>{fees.includes('NaN') ? '$0.00' : fees}</>
}
