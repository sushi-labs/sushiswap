import { formatUSD } from '@sushiswap/format'
import { Row } from '../../Common'
import { FC } from 'react'
import { Token } from '@sushiswap/graph-client'

export const TokenLiquidityCell: FC<Row<Token>> = ({ row }) => {
  const tvl = formatUSD(row.liquidityUSD)

  return <p className="text-sm font-semibold  text-slate-50 text-right">{tvl.includes('NaN') ? '$0.00' : tvl}</p>
}
