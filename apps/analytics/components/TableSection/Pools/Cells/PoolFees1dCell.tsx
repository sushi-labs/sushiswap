import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'
import { Row } from '../../Common/types'

export const PoolFees1dCell: FC<Row<{ fees1d: string | number }>> = ({ row }) => {
  const fees = formatUSD(row.fees1d)

  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {fees.includes('NaN') ? '$0.00' : fees}
    </Typography>
  )
}
