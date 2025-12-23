import { Card, CardContent, CardHeader, CardTitle } from '@sushiswap/ui'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { LiquidityItem } from './LiquidityItem'

interface PoolLiquidityProps {
  pool: PoolInfo
  isLoading?: boolean
}

export const PoolLiquidity = ({
  pool,
  isLoading = false,
}: PoolLiquidityProps) => {
  const { reserves } = pool
  return (
    <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
      <CardHeader>
        <CardTitle>Pool Liquidity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <LiquidityItem
            isLoading={isLoading}
            token={pool.token0}
            amount={reserves.token0.formatted}
          />
          <LiquidityItem
            isLoading={isLoading}
            token={pool.token1}
            amount={reserves.token1.formatted}
          />
        </div>
      </CardContent>
    </Card>
  )
}
