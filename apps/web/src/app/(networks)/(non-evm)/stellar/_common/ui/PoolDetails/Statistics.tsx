import {
  Card,
  CardContent,
  CardGroup,
  CardHeader,
  CardLabel,
  CardTitle,
  SkeletonText,
} from '@sushiswap/ui'
import { formatUSD } from 'sushi/format'
import type { IPool } from '../../lib/hooks/use-pools'

interface StatisticsProps {
  pool: IPool
  isLoading?: boolean
}

export const Statistics = ({ pool, isLoading = false }: StatisticsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <CardGroup>
            <CardLabel>Metrics</CardLabel>
            <div className="space-y-4">
              <div className="w-48">
                <SkeletonText />
              </div>
              <div className="w-48">
                <SkeletonText />
              </div>
              <div className="w-48">
                <SkeletonText />
              </div>
              <div className="w-48">
                <SkeletonText />
              </div>
            </div>
          </CardGroup>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Metrics</CardLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Liquidity</div>
              <div className="text-lg font-semibold">
                {formatUSD(pool.liquidityUSD)}
                <span className="text-sm text-green-600 ml-2">+2.08%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Volume (24h)</div>
              <div className="text-lg font-semibold">
                {formatUSD(pool.volumeUSD1d)}
                <span className="text-sm text-red-600 ml-2">-168.69%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Fees (24h)</div>
              <div className="text-lg font-semibold">
                {formatUSD(pool.feeUSD1d)}
                <span className="text-sm text-red-600 ml-2">-168.69%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Transactions (24h)
              </div>
              <div className="text-lg font-semibold">
                {pool.txCount1d}
                <span className="text-sm text-red-600 ml-2">-52.69%</span>
              </div>
            </div>
          </div>
        </CardGroup>
      </CardContent>
    </Card>
  )
}
