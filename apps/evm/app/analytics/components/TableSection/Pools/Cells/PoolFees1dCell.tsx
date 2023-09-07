import { formatUSD } from '@sushiswap/format'
import { FC } from 'react'

import { Row } from '../../Common/types'

export const PoolFees1dCell: FC<Row<{ fees1d: string | number }>> = ({ row }) => {
  const fees = formatUSD(row.fees1d)

  return <>{fees.includes('NaN') ? '$0.00' : fees}</>
}
