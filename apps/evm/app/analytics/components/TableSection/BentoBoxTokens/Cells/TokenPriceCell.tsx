import { Token } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { FC } from 'react'

export const TokenPriceCell: FC<{ token: Token }> = ({ token }) => {
  const price = formatUSD(0)

  return <p className="text-sm font-semibold  text-right text-slate-50">{price.includes('NaN') ? '$0.00' : price}</p>
}
