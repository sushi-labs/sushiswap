import {
  Card,
  CardContent,
  CardHeader,
  CardLabel,
  CardTitle,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import type { FC } from 'react'
import { formatUSD } from 'sushi'

interface PoolStats {
  volumeUSD1d: number
  volumeUSD1dChange: number
  feesUSD1d: number
  feesUSD1dChange: number
}

function PoolStat({
  label,
  value,
  change,
}: {
  label: string
  value: number | undefined
  change: number | undefined
}) {
  return (
    <div>
      <CardLabel>{label}</CardLabel>
      {value !== undefined && change !== undefined ? (
        <div className="text-xl font-semibold">
          {formatUSD(value)}{' '}
          <span
            className={classNames(
              'text-xs',
              change > 0 ? 'text-green' : 'text-red',
            )}
          >
            ({change.toFixed(2)}
            %)
          </span>
        </div>
      ) : (
        <SkeletonText />
      )}
    </div>
  )
}

/** The pool's rolling 24h volume and fees; skeletons while `stats` loads. */
export const PoolStatsCard: FC<{ stats: PoolStats | undefined }> = ({
  stats,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col justify-between md:flex-row gap-y-4">
            Statistics
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          <PoolStat
            label="Volume (24h)"
            value={stats?.volumeUSD1d}
            change={stats?.volumeUSD1dChange}
          />
          <PoolStat
            label="Fees (24h)"
            value={stats?.feesUSD1d}
            change={stats?.feesUSD1dChange}
          />
        </div>
      </CardContent>
    </Card>
  )
}
