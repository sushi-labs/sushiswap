import { Card, CardContent, CardHeader, CardTitle } from '@sushiswap/ui'
import type React from 'react'
import { formatUSD } from 'sushi/format'
import type { IPool } from '../../lib/hooks/use-pools'
import { LiquidityItem } from './LiquidityItem'

interface MyPositionProps {
  pool: IPool
}

export const MyPosition: React.FC<MyPositionProps> = ({ pool }) => {
  // Mock data for user position - in real implementation, this would come from user's wallet
  const userToken0Amount = '0.0'
  const userToken1Amount = '0.0'
  const userToken0UsdAmount = '0.0'
  const userToken1UsdAmount = '0.0'
  const totalPositionValue = 0

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle>My Position</CardTitle>
        <div className="text-2xl font-bold">
          {formatUSD(totalPositionValue)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <LiquidityItem
            isLoading={false}
            token={pool.token0}
            amount={userToken0Amount}
            usdAmount={userToken0UsdAmount}
          />
          <LiquidityItem
            isLoading={false}
            token={pool.token1}
            amount={userToken1Amount}
            usdAmount={userToken1UsdAmount}
          />
        </div>
      </CardContent>
    </Card>
  )
}
