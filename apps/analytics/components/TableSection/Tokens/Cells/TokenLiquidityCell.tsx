import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { Row } from '../../Common'
import { FC } from 'react'
import { Token } from '@sushiswap/graph-client'

export const TokenLiquidityCell: FC<Row<Token>> = ({ row }) => {
  const tvl = formatUSD(row.liquidityUSD)

  return (
    <Typography variant="sm" weight={600} className="text-slate-50 text-right">
      {tvl.includes('NaN') ? '$0.00' : tvl}
    </Typography>
  )
}
