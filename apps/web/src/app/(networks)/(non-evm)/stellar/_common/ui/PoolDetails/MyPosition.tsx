import { Card, CardContent, CardHeader, CardTitle } from '@sushiswap/ui'
import React from 'react'
import { formatUSD } from 'sushi/format'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { useStellarWallet } from '~stellar/providers'
import { useMyPosition } from '../../lib/hooks/position/use-my-position'
import { CollectFeesBox } from './CollectFeesBox'
import { LiquidityItem } from './LiquidityItem'

interface MyPositionProps {
  pool: PoolInfo
}

export const MyPosition: React.FC<MyPositionProps> = ({ pool }) => {
  const { connectedAddress } = useStellarWallet()

  const { totalValue, assets, isLoading, error } = useMyPosition(
    connectedAddress || undefined,
    pool.address,
  )

  // Extract token amounts from aggregated assets (principal + fees)
  const actualAmounts = React.useMemo(() => {
    const token0Asset = assets.find((asset) => asset.code === pool.token0.code)
    const token1Asset = assets.find((asset) => asset.code === pool.token1.code)

    return {
      token0: token0Asset?.amount || '0.0',
      token1: token1Asset?.amount || '0.0',
    }
  }, [assets, pool.token0.code, pool.token1.code])

  // If no positions found, show empty state
  if (!isLoading && assets.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>My Position</CardTitle>
          <div className="text-md">{formatUSD(0)}</div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <LiquidityItem
              isLoading={false}
              token={pool.token0}
              amount="0.0"
              usdAmount="0.0"
            />
            <LiquidityItem
              isLoading={false}
              token={pool.token1}
              amount="0.0"
              usdAmount="0.0"
            />
          </div>
          {!connectedAddress && (
            <div className="text-center text-sm text-slate-400 mt-4">
              Connect your wallet to view your position
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>My Position</CardTitle>
          <div className="text-md">
            {isLoading ? 'Loading...' : formatUSD(totalValue)}
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-400 text-sm mb-4">
              Error loading position: {error.message}
            </div>
          )}
          <div className="space-y-4">
            <LiquidityItem
              isLoading={isLoading}
              token={pool.token0}
              amount={actualAmounts.token0}
              usdAmount="0.00" // TODO: Calculate USD value
            />
            <LiquidityItem
              isLoading={isLoading}
              token={pool.token1}
              amount={actualAmounts.token1}
              usdAmount="0.00" // TODO: Calculate USD value
            />
          </div>
        </CardContent>
      </Card>

      {/* Collect Fees Box - only shows if there are uncollected fees */}
      <CollectFeesBox pool={pool} />
    </div>
  )
}
