import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  SkeletonText,
} from '@sushiswap/ui'
import { formatUSD } from 'sushi/format'
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
  // TODO(drew): Mock data for token amounts - in real implementation, this would come from pool reserves
  const token0Amount = '1000.0'
  const token1Amount = '500.0'
  const token0UsdAmount = '1000.0'
  const token1UsdAmount = '500.0'

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle>Pool Liquidity</CardTitle>
        {isLoading ? (
          <div className="w-28">
            <SkeletonText fontSize="sm" />
          </div>
        ) : (
          <CardDescription>
            {/* TODO: formatUSD(pool.liquidityUSD) */}
            [tbd: liquidityUSD]
          </CardDescription>
        )}
        <p className="text-sm text-muted-foreground">Tokens</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <LiquidityItem
            isLoading={isLoading}
            token={pool.token0}
            amount={token0Amount}
            usdAmount={token0UsdAmount}
          />
          <LiquidityItem
            isLoading={isLoading}
            token={pool.token1}
            amount={token1Amount}
            usdAmount={token1UsdAmount}
          />
        </div>
      </CardContent>
    </Card>
  )
}
