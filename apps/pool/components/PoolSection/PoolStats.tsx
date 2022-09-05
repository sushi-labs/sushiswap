import { Native } from '@sushiswap/currency'
import { formatNumber, formatUSD } from '@sushiswap/format'
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

  const [totals1d, totals2d] = pair.dayChangeData
  const reserveChange = ((totals1d.liquidityUSD - totals2d.liquidityUSD) / totals2d.liquidityUSD) * 100
  const volChange = ((totals1d.volumeUSD - totals2d.volumeUSD) / totals2d.volumeUSD) * 100
  const txCountChange = ((totals1d.txCount - totals2d.txCount) / totals2d.txCount) * 100

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Liquidity
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(pair.liquidityNative * Number(nativePrice?.toFixed(4)))}
        </Typography>
        <Typography variant="xs" weight={500} className={reserveChange > 0 ? 'text-green' : 'text-red'}>
          {reserveChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(reserveChange))}%
        </Typography>
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Volume (24h)
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(totals1d.volumeUSD)}
        </Typography>
        <Typography variant="xs" weight={500} className={volChange > 0 ? 'text-green' : 'text-red'}>
          {volChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(volChange))}%
        </Typography>
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Fees (24h)
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(totals1d.volumeUSD * (pair.swapFee / 10000))}
        </Typography>
        <Typography variant="xs" weight={500} className={volChange > 0 ? 'text-green' : 'text-red'}>
          {volChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(volChange))}%
        </Typography>
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Transactions (24h)
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatNumber(totals1d.txCount)}
        </Typography>
        <Typography variant="xs" weight={500} className={txCountChange > 0 ? 'text-green' : 'text-red'}>
          {txCountChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(txCountChange))}%
        </Typography>
      </div>
    </div>
  )
}
