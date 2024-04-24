'use client'

import { Pool } from '@sushiswap/client'
import {
  Card,
  CardContent,
  CardHeader,
  CardLabel,
  CardTitle,
  classNames,
} from '@sushiswap/ui'
import { SkeletonText } from '@sushiswap/ui/components/skeleton'
import { FC } from 'react'
import { usePoolGraphData } from 'src/lib/hooks'
import { ChainId } from 'sushi/chain'
import { formatNumber, formatPercent, formatUSD } from 'sushi/format'

interface PoolStats {
  pool: Pool
}

export const PoolStats: FC<PoolStats> = ({ pool }) => {
  const { data, isLoading } = usePoolGraphData({
    poolAddress: pool.address,
    chainId: pool.chainId as ChainId,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <CardLabel>Liquidity</CardLabel>
            {isLoading ? (
              <SkeletonText />
            ) : data ? (
              <div className="text-xl font-semibold">
                {formatUSD(data.liquidityUSD ?? 0)}{' '}
                <span
                  className={classNames(
                    'text-xs',
                    data.liquidity1dChange > 0 ? 'text-green' : 'text-red',
                  )}
                >
                  {data.liquidity1dChange > 0 ? '+' : '-'}
                  {formatPercent(Math.abs(data.liquidity1dChange))}
                </span>
              </div>
            ) : null}
          </div>
          <div>
            <CardLabel>Volume (24h)</CardLabel>
            {data ? (
              <div className="text-xl font-semibold">
                {formatUSD(data.volume1d ?? 0)}{' '}
                <span
                  className={classNames(
                    'text-xs',
                    data.volume1dChange > 0 ? 'text-green' : 'text-red',
                  )}
                >
                  {data.volume1dChange > 0 ? '+' : '-'}
                  {formatPercent(Math.abs(data.volume1dChange))}
                </span>
              </div>
            ) : isLoading ? (
              <SkeletonText />
            ) : null}
          </div>
          <div>
            <CardLabel>Fees (24h)</CardLabel>
            {data ? (
              <div className="text-xl font-semibold">
                {formatUSD(data.fees1d ?? 0)}{' '}
                <span
                  className={classNames(
                    'text-xs',
                    data.fees1dChange > 0 ? 'text-green' : 'text-red',
                  )}
                >
                  {data.fees1dChange > 0 ? '+' : '-'}
                  {formatPercent(Math.abs(data.fees1dChange))}
                </span>
              </div>
            ) : isLoading ? (
              <SkeletonText />
            ) : null}
          </div>
          <div>
            <CardLabel>Transactions (24h)</CardLabel>
            {data ? (
              <div className="text-xl font-semibold">
                {formatNumber(data.txCount1d).replace('.00', '')}{' '}
                <span
                  className={classNames(
                    'text-xs',
                    data.txCount1dChange > 0 ? 'text-green' : 'text-red',
                  )}
                >
                  {data.txCount1dChange > 0 ? '+' : '-'}
                  {formatPercent(Math.abs(data.txCount1dChange))}
                </span>
              </div>
            ) : isLoading ? (
              <SkeletonText />
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
