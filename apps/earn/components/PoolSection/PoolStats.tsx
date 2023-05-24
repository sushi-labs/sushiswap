import { formatNumber, formatPercent, formatUSD } from '@sushiswap/format'
import { Pool } from '@sushiswap/client'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'
import { useGraphPool } from '../../lib/hooks'

interface PoolStats {
  pool: Pool
}

export const PoolStats: FC<PoolStats> = ({ pool }) => {
  // const { data: prices } = usePrices({ chainId: pool.chainId })
  // let nativePrice = prices?.[Native.onChain(pool.chainId).wrapped.address]

  // if (pool.chainId === ChainId.POLYGON) {
  //   nativePrice = prices?.['0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619']
  // }

  const {
    data: {
      liquidityUSD,
      liquidity1dChange,
      fees1d,
      fees1dChange,
      volume1d,
      volume1dChange,
      txCount1d,
      txCount1dChange,
    },
  } = useGraphPool(pool)

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="flex flex-col gap-1 p-3 rounded-md bg-white dark:bg-slate-800 ">
        <Typography variant="xs" weight={500} className="text-gray-500 dark:text-slate-400 text-slate-600">
          Liquidity
        </Typography>
        <Typography weight={500} className="text-gray-900 dark:text-slate-50">
          {formatUSD(liquidityUSD ?? 0)}
        </Typography>
        {liquidity1dChange ? (
          <Typography variant="xs" weight={500} className={liquidity1dChange > 0 ? 'text-green' : 'text-red'}>
            {liquidity1dChange > 0 ? '+' : '-'}
            {formatPercent(Math.abs(liquidity1dChange))}
          </Typography>
        ) : (
          <Typography variant="xs" weight={500} className="text-gray-900 dark:text-slate-50">
            -
          </Typography>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md bg-white dark:bg-slate-800 ">
        <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600">
          Volume (24h)
        </Typography>
        <Typography weight={500} className="text-gray-900 dark:text-slate-50">
          {formatUSD(volume1d ?? 0)}
        </Typography>
        {volume1dChange ? (
          <Typography variant="xs" weight={500} className={volume1dChange > 0 ? 'text-green' : 'text-red'}>
            {volume1dChange > 0 ? '+' : '-'}
            {formatPercent(Math.abs(volume1dChange))}
          </Typography>
        ) : (
          <Typography variant="xs" weight={500} className="text-gray-900 dark:text-slate-50">
            -
          </Typography>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md bg-white dark:bg-slate-800 ">
        <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600">
          Fees (24h)
        </Typography>
        <Typography weight={500} className="text-gray-900 dark:text-slate-50">
          {formatUSD(fees1d ?? 0)}
        </Typography>
        {fees1dChange ? (
          <Typography variant="xs" weight={500} className={fees1dChange > 0 ? 'text-green' : 'text-red'}>
            {fees1dChange > 0 ? '+' : '-'}
            {formatPercent(Math.abs(fees1dChange))}
          </Typography>
        ) : (
          <Typography variant="xs" weight={500} className="text-gray-900 dark:text-slate-50">
            -
          </Typography>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md bg-white dark:bg-slate-800 ">
        <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600">
          Transactions (24h)
        </Typography>
        <Typography weight={500} className="text-gray-900 dark:text-slate-50">
          {/* Don't need decimals for a count */}
          {formatNumber(txCount1d).replace('.00', '')}
        </Typography>
        {txCount1dChange ? (
          <Typography variant="xs" weight={500} className={txCount1dChange > 0 ? 'text-green' : 'text-red'}>
            {txCount1dChange > 0 ? '+' : '-'}
            {formatPercent(Math.abs(txCount1dChange))}
          </Typography>
        ) : (
          <Typography variant="xs" weight={500} className="text-gray-900 dark:text-slate-50">
            -
          </Typography>
        )}
      </div>
    </div>
  )
}
