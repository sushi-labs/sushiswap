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

const getTextColor = (value: number) => {
  if (value === 0) return 'text-gray-500'
  return value > 0 ? 'text-green' : 'text-red'
}

const getChangeSign = (value: number) => {
  if (value === 0) return ''
  return value > 0 ? '+' : '-'
}

export const PoolStats: FC<PoolStats> = ({ pool }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          <Item
            label="Liquidity"
            value={formatUSD(pool?.tvlUsd ?? 0)}
            change={pool?.tvlChange24h ?? 0}
          />
          <Item
            label="Volume (24h)"
            value={formatUSD(pool?.volume24hUsd ?? 0)}
            change={pool?.volumeChange24h ?? 0}
          />
          <Item
            label="Fees (24h)"
            value={formatUSD(pool?.fees24hUsd ?? 0)}
            change={pool?.feesChange24h ?? 0}
          />
          <Item
            label="Transactions (24h)"
            value={formatNumber(pool?.transactionCount24h ?? 0).replace(
              '.00',
              '',
            )}
            change={pool?.transactionCountChange24h ?? 0}
          />
        </div>
      </CardContent>
    </Card>
  )
}

const Item = ({
  label,
  value,
  change,
}: { label: string; value: number | string; change: number }) => {
  return (
    <div>
      <CardLabel>{label}</CardLabel>
      <div className="text-xl font-semibold">
        {value}{' '}
        <span className={classNames('text-xs', getTextColor(change))}>
          {getChangeSign(change)}
          {formatPercent(Math.abs(change))}
        </span>
      </div>
    </div>
  )
}
