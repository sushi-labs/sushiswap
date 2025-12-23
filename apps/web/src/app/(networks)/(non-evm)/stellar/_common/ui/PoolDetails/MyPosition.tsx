import { Card, CardContent, CardHeader, CardTitle } from '@sushiswap/ui'
import React from 'react'
import { formatUSD } from 'sushi'
import { useStablePrice } from '~stellar/_common/lib/hooks/price/use-stable-price'
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

  const {
    isLoading: isLoadingPositions,
    positions,
    error,
  } = useMyPosition({
    userAddress: connectedAddress ?? undefined,
    poolAddress: pool.address,
    excludeDust: true,
  })
  const { data: priceToken0, isLoading: isLoadingPriceToken0 } = useStablePrice(
    { token: pool.token0 },
  )
  const { data: priceToken1, isLoading: isLoadingPriceToken1 } = useStablePrice(
    { token: pool.token1 },
  )

  const isLoading =
    isLoadingPositions || isLoadingPriceToken0 || isLoadingPriceToken1

  // Extract principal token amounts from aggregated positions
  const actualAmounts = React.useMemo(() => {
    return positions.reduce(
      (acc, cur) => {
        return {
          token0: acc.token0 + cur.principalToken0,
          token1: acc.token1 + cur.principalToken1,
        }
      },
      { token0: 0n, token1: 0n },
    )
  }, [positions])

  const token0UsdValue =
    Number(formatTokenAmount(actualAmounts.token0, pool.token0.decimals)) *
    Number(priceToken0 ?? 0)

  const token1UsdValue =
    Number(formatTokenAmount(actualAmounts.token1, pool.token1.decimals)) *
    Number(priceToken1 ?? 0)

  // If no positions found, show empty state
  if (!isLoading && positions.length === 0) {
    return (
      <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
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
      <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
        <CardHeader>
          <CardTitle>My Position</CardTitle>
          <div className="text-md">
            {isLoading
              ? 'Loading...'
              : formatUSD(token0UsdValue + token1UsdValue)}
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
              usdAmount={token0UsdValue.toFixed(2)}
            />
            <LiquidityItem
              isLoading={isLoading}
              token={pool.token1}
              amount={formatTokenAmount(
                actualAmounts.token1,
                pool.token1.decimals,
              )}
              usdAmount={token1UsdValue.toFixed(2)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Collect Fees Box - only shows if there are uncollected fees */}
      <CollectFeesBox pool={pool} />
    </div>
  )
}
