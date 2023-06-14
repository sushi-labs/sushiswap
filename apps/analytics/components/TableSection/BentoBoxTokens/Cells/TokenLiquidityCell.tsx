import { Amount, Token } from '@sushiswap/currency'
import { formatNumber } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

export const TokenLiquidityCell: FC<{ liquidity: Amount<Token> }> = ({ liquidity }) => {
  const number = formatNumber(liquidity.toSignificant(4))

  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {number === 'NaN' ? '0' : number}
    </Typography>
  )
}
