import { formatUSD } from '@sushiswap/format'
import { Token as GraphToken } from '@sushiswap/graph-client'
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
        <p className="text-xs font-medium text-slate-400">Liquidity</p>
        <p className="font-medium text-slate-50">{tvl.includes('NaN') ? '$0.00' : tvl}</p>
        {/* <p variant="xs" weight={500} className={reserveChange > 0 ? 'text-green' : 'text-red'}>
          {reserveChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(reserveChange))}%
        </p> */}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <p className="text-xs font-medium text-slate-400">Volume</p>
        <p className="font-medium text-slate-50">{volume.includes('NaN') ? '$0.00' : volume}</p>
        {/* <p variant="xs" weight={500} className={reserveChange > 0 ? 'text-green' : 'text-red'}>
          {reserveChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(reserveChange))}%
        </p> */}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <p className="text-xs font-medium text-slate-400">Fees</p>
        <p className="font-medium text-slate-50">{fees.includes('NaN') ? '$0.00' : fees}</p>
        {/* <p variant="xs" weight={500} className={reserveChange > 0 ? 'text-green' : 'text-red'}>
          {reserveChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(reserveChange))}%
        </p> */}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <p className="text-xs font-medium text-slate-400">Market Cap</p>
        <p className="font-medium text-slate-50">{fees.includes('NaN') ? '$0.00' : fees}</p>
        {/* <p variant="xs" weight={500} className={reserveChange > 0 ? 'text-green' : 'text-red'}>
          {reserveChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(reserveChange))}%
        </p> */}
      </div>
    </div>
  )
}
