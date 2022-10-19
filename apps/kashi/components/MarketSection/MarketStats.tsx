import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import { FC } from 'react'

interface MarketStats {
  pair: KashiMediumRiskLendingPairV1
}

export const MarketStats: FC<MarketStats> = ({ pair }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Supplied
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(pair.totalAssetUSD + pair.totalBorrowUSD)}
        </Typography>
        {/* <Typography variant="xs" weight={500} className={totalSupplyChange > 0 ? 'text-green' : 'text-red'}>
          {totalSupplyChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(totalSupplyChange))}%
        </Typography> */}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Borrowed
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(pair.totalBorrowUSD)}
        </Typography>
        {/* <Typography variant="xs" weight={500} className={totalBorrowChange > 0 ? 'text-green' : 'text-red'}>
          {totalBorrowChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(totalBorrowChange))}%
        </Typography> */}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md shadow-md bg-slate-800 shadow-black/20">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Available
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(pair.totalAssetUSD)}
        </Typography>
        {/* <Typography variant="xs" weight={500} className={borrowedChange > 0 ? 'text-green' : 'text-red'}>
          {borrowedChange > 0 ? '+' : '-'}
          {formatNumber(Math.abs(borrowedChange))}%
        </Typography> */}
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
