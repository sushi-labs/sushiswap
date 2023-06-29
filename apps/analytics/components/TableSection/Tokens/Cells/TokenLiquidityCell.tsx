import { formatUSD } from '@sushiswap/format'
import { Token } from '@sushiswap/graph-client'
import { FC } from 'react'

import { Row } from '../../Common'

export const TokenLiquidityCell: FC<Row<Token>> = ({ row }) => {
  const tvl = formatUSD(row.liquidityUSD)

  return <p className="text-sm font-semibold  text-slate-50 text-right">{tvl.includes('NaN') ? '$0.00' : tvl}</p>
}
