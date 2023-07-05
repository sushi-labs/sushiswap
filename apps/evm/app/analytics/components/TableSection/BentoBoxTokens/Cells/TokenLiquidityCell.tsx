import { Amount, Token } from '@sushiswap/currency'
import { formatNumber } from '@sushiswap/format'
import { FC } from 'react'

export const TokenLiquidityCell: FC<{ liquidity: Amount<Token> }> = ({ liquidity }) => {
  const number = formatNumber(liquidity.toSignificant(4))

  return <p className="text-sm font-semibold  text-right text-slate-50">{number === 'NaN' ? '0' : number}</p>
}
