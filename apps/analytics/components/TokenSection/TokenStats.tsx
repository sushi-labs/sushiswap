import { formatNumber, formatUSD } from '@sushiswap/format'
import { Token as GraphToken } from '@sushiswap/graph-client'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

interface TokenStatsProps {
  token: GraphToken
}

export const TokenStats: FC<TokenStatsProps> = ({ token }) => {
  const tvl = formatUSD(token.liquidityUSD)
  const volume = formatUSD(token.volumeUSD)
  const fees = formatUSD(token.feesUSD)
  const reserveChange = 10

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Liquidity
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {tvl.includes('NaN') ? '$0.00' : tvl}
        </Typography>
        {/* <Typography variant="xs" weight={500} className={reserveChange > 0 ? 'text-green' : 'text-red'}>
          {reserveChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(reserveChange))}%
        </Typography> */}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Volume
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {volume.includes('NaN') ? '$0.00' : volume}
        </Typography>
        {/* <Typography variant="xs" weight={500} className={reserveChange > 0 ? 'text-green' : 'text-red'}>
          {reserveChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(reserveChange))}%
        </Typography> */}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Fees
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {fees.includes('NaN') ? '$0.00' : fees}
        </Typography>
        {/* <Typography variant="xs" weight={500} className={reserveChange > 0 ? 'text-green' : 'text-red'}>
          {reserveChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(reserveChange))}%
        </Typography> */}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Market Cap
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {fees.includes('NaN') ? '$0.00' : fees}
        </Typography>
        {/* <Typography variant="xs" weight={500} className={reserveChange > 0 ? 'text-green' : 'text-red'}>
          {reserveChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(reserveChange))}%
        </Typography> */}
      </div>
    </div>
  )
}
