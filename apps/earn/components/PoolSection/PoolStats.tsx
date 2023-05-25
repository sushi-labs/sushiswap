import { formatNumber, formatPercent, formatUSD } from '@sushiswap/format'
import { Pool } from '@sushiswap/client'
import { FC } from 'react'
import { usePoolGraphData } from '../../lib/hooks'
import { ChainId } from '@sushiswap/chain'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { classNames } from '@sushiswap/ui'

interface PoolStats {
  pool: Pool
}

export const PoolStats: FC<PoolStats> = ({ pool }) => {
  const { data, isLoading } = usePoolGraphData({
    poolAddress: pool.address,
    chainId: pool.chainId as ChainId,
  })

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="flex flex-col gap-1 p-3 rounded-md bg-white dark:bg-slate-200 dark:bg-opacity-[0.04]">
        <span className="text-xs text-gray-500 dark:text-slate-400">Liquidity</span>
        {isLoading ? (
          <Skeleton.Text fontSize="text-base" />
        ) : data ? (
          <span className="font-medium text-gray-900 dark:text-slate-50">{formatUSD(data.liquidityUSD ?? 0)}</span>
        ) : (
          <></>
        )}
        {data ? (
          <span className={classNames('font-medium', data.liquidity1dChange > 0 ? 'text-green' : 'text-red')}>
            {data.liquidity1dChange > 0 ? '+' : '-'}
            {formatPercent(Math.abs(data.liquidity1dChange))}
          </span>
        ) : isLoading ? (
          <Skeleton.Text fontSize="text-xs" />
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md bg-white dark:bg-slate-200 dark:bg-opacity-[0.04]">
        <span className="text-xs text-gray-500 dark:text-slate-400">Volume (24h)</span>
        {data ? (
          <span className="font-medium text-gray-900 dark:text-slate-50">{formatUSD(data.volume1d ?? 0)}</span>
        ) : isLoading ? (
          <Skeleton.Text fontSize="text-base" />
        ) : (
          <></>
        )}
        {data ? (
          <span className={classNames('text-xs', data.volume1dChange > 0 ? 'text-green' : 'text-red')}>
            {data.volume1dChange > 0 ? '+' : '-'}
            {formatPercent(Math.abs(data.volume1dChange))}
          </span>
        ) : isLoading ? (
          <Skeleton.Text fontSize="text-xs" />
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md bg-white dark:bg-slate-200 dark:bg-opacity-[0.04]">
        <span className="text-xs text-gray-500 dark:text-slate-400">Fees (24h)</span>

        {data ? (
          <span className="font-medium text-gray-900 dark:text-slate-50">{formatUSD(data.fees1d ?? 0)}</span>
        ) : isLoading ? (
          <Skeleton.Text fontSize="text-base" />
        ) : (
          <></>
        )}
        {data ? (
          <span className={classNames('text-xs', data.fees1dChange > 0 ? 'text-green' : 'text-red')}>
            {data.fees1dChange > 0 ? '+' : '-'}
            {formatPercent(Math.abs(data.fees1dChange))}
          </span>
        ) : isLoading ? (
          <Skeleton.Text fontSize="text-xs" />
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-md bg-white dark:bg-slate-200 dark:bg-opacity-[0.04]">
        <span className="text-xs text-gray-500 dark:text-slate-400">Transactions (24h)</span>
        {data ? (
          <span className="font-medium text-gray-900 dark:text-slate-50">
            {/* Don't need decimals for a count */}
            {formatNumber(data.txCount1d).replace('.00', '')}
          </span>
        ) : isLoading ? (
          <Skeleton.Text fontSize="text-base" />
        ) : (
          <></>
        )}
        {data ? (
          <span className={classNames('text-xs', data.txCount1dChange > 0 ? 'text-green' : 'text-red')}>
            {data.txCount1dChange > 0 ? '+' : '-'}
            {formatPercent(Math.abs(data.txCount1dChange))}
          </span>
        ) : isLoading ? (
          <Skeleton.Text fontSize="text-xs" />
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
