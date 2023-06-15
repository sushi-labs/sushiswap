import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'
import { Row } from '../../Common/types'

export const PoolFees1mCell: FC<Row<{ fees1m: string | number }>> = ({ row }) => {
  const fees = formatUSD(row.fees1m)
  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {fees.includes('NaN') ? '$0.00' : fees}
    </Typography>
  )
}
