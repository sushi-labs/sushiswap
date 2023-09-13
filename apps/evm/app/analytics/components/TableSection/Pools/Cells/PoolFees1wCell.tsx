import { formatUSD } from '@sushiswap/format'
import { FC } from 'react'

import { Row } from '../../Common/types'

export const PoolFees1wCell: FC<Row<{ fees1w: string | number }>> = ({ row }) => {
  const fees = formatUSD(row.fees1w)
  return <>{fees.includes('NaN') ? '$0.00' : fees}</>
}
