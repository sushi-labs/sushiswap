import { Card, CardContent, CardHeader, CardTitle } from '@sushiswap/ui'
import React from 'react'
import { formatUSD } from 'sushi/format'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { formatTokenAmount } from '~stellar/_common/lib/utils/format'
import { useStellarWallet } from '~stellar/providers'
import { useMyPosition } from '../../lib/hooks/position/use-my-position'
import { CollectFeesBox } from './CollectFeesBox'
import { LiquidityItem } from './LiquidityItem'

interface MyPositionProps {
  pool: PoolInfo
}

export const MyPosition: React.FC<MyPositionProps> = ({ pool }) => {
  const { connectedAddress } = useStellarWallet()

  const { totalValue, isLoading, positions, error } = useMyPosition(
    connectedAddress ?? undefined,
    pool.address,
  )

  // Extract token amounts from aggregated positions (principal + fees)
  const actualAmounts = React.useMemo(() => {
    return positions.reduce(
      (acc, cur) => {
        return {
          token0: acc.token0 + cur.principalToken0 + cur.feesToken0,
          token1: acc.token1 + cur.principalToken1 + cur.feesToken1,
        }
      },
      { token0: 0n, token1: 0n },
    )
  }, [positions])

  // If no positions found, show empty state
  if (!isLoading && positions.length === 0) {
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
              amount={formatTokenAmount(
                actualAmounts.token0,
                pool.token0.decimals,
              )}
              usdAmount="0.00" // Price data is calculated in totalValue
            />
            <LiquidityItem
              isLoading={isLoading}
              token={pool.token1}
              amount={formatTokenAmount(
                actualAmounts.token1,
                pool.token1.decimals,
              )}
              usdAmount="0.00" // Price data is calculated in totalValue
            />
          </div>
        </CardContent>
      </Card>

      {/* Collect Fees Box - only shows if there are uncollected fees */}
      <CollectFeesBox pool={pool} />
    </div>
  )
}
