import { formatUSD } from '@sushiswap/format'
import { Token } from '@sushiswap/currency'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

export const TokenPriceCell: FC<{ token: Token }> = ({ token }) => {
  const price = formatUSD(0)

  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {price.includes('NaN') ? '$0.00' : price}
    </Typography>
  )
}
