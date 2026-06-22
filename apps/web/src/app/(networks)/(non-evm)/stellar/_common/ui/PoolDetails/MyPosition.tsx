import { Card, CardContent, CardHeader, CardTitle } from '@sushiswap/ui'
import React from 'react'
import { Amount, formatUSD } from 'sushi'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
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

  const {
    isLoading: isLoadingPositions,
    positions,
    error,
  } = useMyPosition({
    userAddress: connectedAddress ?? undefined,
    poolAddress: pool.address,
    excludeDust: true,
  })
  const { data: priceToken0, isLoading: isLoadingPriceToken0 } = usePrice({
    chainId: pool.token0.chainId,
    address: pool.token0.address,
  })
  const { data: priceToken1, isLoading: isLoadingPriceToken1 } = usePrice({
    chainId: pool.token1.chainId,
    address: pool.token1.address,
  })

  const isLoading =
    isLoadingPositions || isLoadingPriceToken0 || isLoadingPriceToken1

  // Extract principal token amounts from aggregated positions
  const actualAmounts = React.useMemo(() => {
    return positions.reduce(
      (acc, cur) => ({
        token0: acc.token0.add(cur.principalToken0),
        token1: acc.token1.add(cur.principalToken1),
      }),
      {
        token0: new Amount(pool.token0, 0n),
        token1: new Amount(pool.token1, 0n),
      },
    )
  }, [positions, pool.token0, pool.token1])

  const token0UsdValue =
    Number(actualAmounts.token0.toString()) * Number(priceToken0 ?? 0)

  const token1UsdValue =
    Number(actualAmounts.token1.toString()) * Number(priceToken1 ?? 0)

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
              amount={actualAmounts.token0.toString()}
              usdAmount={token0UsdValue.toFixed(2)}
            />
            <LiquidityItem
              isLoading={isLoading}
              token={pool.token1}
              amount={actualAmounts.token1.toString()}
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
