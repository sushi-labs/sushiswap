import { Native } from '@sushiswap/currency'
import { formatNumber, formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { usePrices } from '@sushiswap/wagmi'
import { FC } from 'react'

import { KashiPair } from '../../.graphclient'

interface MarketStats {
  pair: KashiPair
}

// TODO MAKE DYNAMIC
const FEE_BPS = 0.0005

export const MarketStats: FC<MarketStats> = ({ pair }) => {
  const { data: prices } = usePrices({ chainId: pair.chainId })
  const nativePrice = prices?.[Native.onChain(pair.chainId).wrapped.address]

  // const [totals1d, totals2d] = pair.dayChangeData
  const totalSupplyChange = 0.5
  const totalBorrowChange = -0.5
  const borrowedChange = 0.5

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Total Supply
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(pair.totalAsset.elastic / 1e18)}
        </Typography>
        <Typography variant="xs" weight={500} className={totalSupplyChange > 0 ? 'text-green' : 'text-red'}>
          {totalSupplyChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(totalSupplyChange))}%
        </Typography>
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Total Borrow
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(pair.totalBorrow.elastic / 1e18)}
        </Typography>
        <Typography variant="xs" weight={500} className={totalBorrowChange > 0 ? 'text-green' : 'text-red'}>
          {totalBorrowChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(totalBorrowChange))}%
        </Typography>
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Borrowed
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(9348938)}
        </Typography>
        <Typography variant="xs" weight={500} className={borrowedChange > 0 ? 'text-green' : 'text-red'}>
          {borrowedChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(borrowedChange))}%
        </Typography>
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          LTV
        </Typography>
        <Typography weight={500} className="text-slate-50">
          75%
        </Typography>
      </div>
    </div>
  )
}
