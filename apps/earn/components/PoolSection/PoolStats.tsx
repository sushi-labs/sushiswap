import { Native } from '@sushiswap/currency'
import { formatNumber, formatPercent, formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { usePrices } from '@sushiswap/wagmi'
import { FC } from 'react'

import { PairWithAlias } from '../../types'

interface PoolStats {
  pair: PairWithAlias
}

export const PoolStats: FC<PoolStats> = ({ pair }) => {
  const { data: prices } = usePrices({ chainId: pair.chainId })
  const nativePrice = prices?.[Native.onChain(pair.chainId).wrapped.address]
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Liquidity
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(pair.liquidityNative * Number(nativePrice?.toFixed(4)))}
        </Typography>
        {pair.liquidity1dChange ? (
          <Typography variant="xs" weight={500} className={pair.liquidity1dChange > 0 ? 'text-green' : 'text-red'}>
            {pair.liquidity1dChange > 0 ? '+' : '-'}
            {formatPercent(Math.abs(pair.liquidity1dChange))}
          </Typography>
        ) : null}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Volume (24h)
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(pair.volume1d)}
        </Typography>
        {pair.volume1dChange ? (
          <Typography variant="xs" weight={500} className={pair.volume1dChange > 0 ? 'text-green' : 'text-red'}>
            {pair.volume1dChange > 0 ? '+' : '-'}
            {formatPercent(Math.abs(pair.volume1dChange))}
          </Typography>
        ) : null}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Fees (24h)
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(pair.volume1d * (pair.swapFee / 10000))}
        </Typography>
        {pair.volume1dChange ? (
          <Typography variant="xs" weight={500} className={pair.volume1dChange > 0 ? 'text-green' : 'text-red'}>
            {pair.volume1dChange > 0 ? '+' : '-'}
            {formatPercent(Math.abs(pair.volume1dChange))}
          </Typography>
        ) : null}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Transactions (24h)
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {/* Don't need decimals for a count */}
          {formatNumber(pair.txCount1d).replace('.00', '')}
        </Typography>
        {pair.txCount1dChange ? (
          <Typography variant="xs" weight={500} className={pair.txCount1dChange > 0 ? 'text-green' : 'text-red'}>
            {pair.txCount1dChange > 0 ? '+' : '-'}
            {formatPercent(Math.abs(pair.txCount1dChange))}
          </Typography>
        ) : null}
      </div>
    </div>
  )
}
