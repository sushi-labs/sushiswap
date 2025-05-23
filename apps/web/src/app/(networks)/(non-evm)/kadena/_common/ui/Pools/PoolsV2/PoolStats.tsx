'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardLabel,
  CardTitle,
  classNames,
} from '@sushiswap/ui'
import type { FC } from 'react'
import { formatNumber, formatPercent, formatUSD } from 'sushi/format'
import type { PoolByIdResponse } from '~kadena/_common/types/get-pool-by-id'

interface PoolStats {
  pool: PoolByIdResponse | undefined
}

export const PoolStats: FC<PoolStats> = ({ pool }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <CardLabel>Liquidity</CardLabel>
            {pool ? (
              <div className="text-xl font-semibold">
                {formatUSD(pool.tvlUsd ?? 0)}{' '}
                <span
                  className={classNames(
                    'text-xs',
                    pool.tvlChange24h > 0 ? 'text-green' : 'text-red',
                  )}
                >
                  {pool.tvlChange24h > 0 ? '+' : '-'}
                  {formatPercent(Math.abs(pool.tvlChange24h))}
                </span>
              </div>
            ) : null}
          </div>
          <div>
            <CardLabel>Volume (24h)</CardLabel>
            {pool ? (
              <div className="text-xl font-semibold">
                {formatUSD(pool.volume24hUsd ?? 0)}{' '}
                <span
                  className={classNames(
                    'text-xs',
                    pool.volumeChange24h > 0 ? 'text-green' : 'text-red',
                  )}
                >
                  {pool.volumeChange24h > 0 ? '+' : '-'}
                  {formatPercent(Math.abs(pool.volumeChange24h))}
                </span>
              </div>
            ) : null}
          </div>
          <div>
            <CardLabel>Fees (24h)</CardLabel>
            {pool ? (
              <div className="text-xl font-semibold">
                {formatUSD(pool.fees24hUsd ?? 0)}{' '}
                <span
                  className={classNames(
                    'text-xs',
                    pool.feesChange24h > 0 ? 'text-green' : 'text-red',
                  )}
                >
                  {pool.feesChange24h > 0 ? '+' : '-'}
                  {formatPercent(Math.abs(pool.feesChange24h))}
                </span>
              </div>
            ) : null}
          </div>
          <div>
            <CardLabel>Transactions (24h)</CardLabel>
            {pool ? (
              <div className="text-xl font-semibold">
                {formatNumber(pool.transactionCount24h).replace('.00', '')}{' '}
                <span
                  className={classNames(
                    'text-xs',
                    pool.transactionCountChange24h > 0
                      ? 'text-green'
                      : 'text-red',
                  )}
                >
                  {pool.transactionCountChange24h > 0 ? '+' : '-'}
                  {formatPercent(Math.abs(pool.transactionCountChange24h))}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
