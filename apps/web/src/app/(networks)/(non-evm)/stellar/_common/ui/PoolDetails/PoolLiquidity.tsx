import { Card, CardContent, CardHeader, CardTitle } from '@sushiswap/ui'
import { formatUnits } from 'viem'
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
            amount={formatUnits(
              BigInt(reserves.token0.amount),
              pool.token0.decimals,
            )}
          />
          <LiquidityItem
            isLoading={isLoading}
            token={pool.token1}
            amount={formatUnits(
              BigInt(reserves.token1.amount),
              pool.token1.decimals,
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
