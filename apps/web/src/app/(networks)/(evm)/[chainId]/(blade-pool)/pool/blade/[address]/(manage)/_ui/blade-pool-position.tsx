'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@sushiswap/ui'
import { Button, Currency, SkeletonText } from '@sushiswap/ui'
import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { formatPercent, formatUSD } from 'sushi'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { CurrencyFiatIcon } from '@sushiswap/ui/icons/CurrencyFiatIcon'
import { getPoolAssets, getPoolTokensGrouped } from 'src/lib/pool/blade'
import { useUnlockDeposit } from 'src/lib/pool/blade/useUnlockDeposit'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useTotalSupply } from 'src/lib/wagmi/hooks/tokens/useTotalSupply'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'wagmi'
import { useBladePoolPosition } from './blade-pool-position-provider'

interface PoolPositionProps {
  pool: BladePool
}

const PoolPositionDisconnected: FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Position</CardTitle>
      </CardHeader>
      <CardContent>
        <ConnectButton fullWidth variant="secondary" />
      </CardContent>
    </Card>
  )
}

const PoolPositionConnected: FC<PoolPositionProps> = ({ pool }) => {
  const [showStableTypes, setShowStableTypes] = useState(false)
  const {
    balance,
    vestingDeposit,
    liquidityToken,
    isLoading,
    refetch: refetchPosition,
  } = useBladePoolPosition()
  const poolTotalSupply = useTotalSupply(liquidityToken)

  const canUnlock = useMemo(() => {
    if (!vestingDeposit?.balance || !vestingDeposit.lockedUntil) return false
    return (
      vestingDeposit.balance > 0n && new Date() >= vestingDeposit.lockedUntil
    )
  }, [vestingDeposit?.balance, vestingDeposit?.lockedUntil])

  const { write: unlockDeposit, isPending: isUnlocking } = useUnlockDeposit({
    pool,
    enabled: canUnlock,
    onSuccess: () => {
      refetchPosition()
    },
  })

  const positionValue = useMemo(() => {
    if (
      !balance?.amount ||
      !poolTotalSupply?.amount ||
      poolTotalSupply.amount === 0n
    ) {
      return 0
    }

    const poolProportion =
      Number(balance.amount) / Number(poolTotalSupply.amount)
    return pool.liquidityUSD * poolProportion
  }, [balance, poolTotalSupply, pool.liquidityUSD])

  const lockedPositionValue = useMemo(() => {
    if (
      !vestingDeposit?.balance ||
      !poolTotalSupply?.amount ||
      poolTotalSupply.amount === 0n
    ) {
      return 0
    }

    const poolProportion =
      Number(vestingDeposit.balance) / Number(poolTotalSupply.amount)
    return pool.liquidityUSD * poolProportion
  }, [vestingDeposit?.balance, poolTotalSupply, pool.liquidityUSD])

  const assets = useMemo(() => {
    return getPoolAssets(pool, { showStableTypes }).filter(
      (asset) => asset.targetWeight > 0,
    )
  }, [pool, showStableTypes])

  const { stablecoinUsdTokens } = useMemo(() => {
    return getPoolTokensGrouped(pool)
  }, [pool])

  const hasStablecoins = stablecoinUsdTokens.length > 0

  const totalValue = positionValue + lockedPositionValue

  return (
    <Card className="bg-white dark:bg-secondary border border-accent rounded-xl shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-slate-50">
          Position Details
        </CardTitle>
      </CardHeader>
      <CardContent className="!pt-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900 dark:text-slate-50">
              Total
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-slate-50">
              {isLoading ? (
                <SkeletonText className="w-16" />
              ) : (
                formatUSD(totalValue)
              )}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-normal text-gray-500">
              Position Value
            </span>
            <span className="text-sm font-normal text-gray-700 dark:text-gray-300">
              {isLoading ? (
                <SkeletonText className="w-16" />
              ) : (
                formatUSD(positionValue)
              )}
            </span>
          </div>

          {lockedPositionValue > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col text-gray-500">
                  <span className="text-sm font-normal">
                    Locked Position Value
                  </span>
                  {vestingDeposit?.lockedUntil && !canUnlock && (
                    <span className="text-xs font-normal">
                      Unlocks {vestingDeposit.lockedUntil.toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="text-sm font-normal text-gray-700 dark:text-gray-300">
                  {isLoading ? (
                    <SkeletonText className="w-16" />
                  ) : (
                    formatUSD(lockedPositionValue)
                  )}
                </span>
              </div>

              <div className="flex justify-end">
                {canUnlock && (
                  <Checker.Connect size="sm">
                    <Checker.Network size="sm" chainId={pool.chainId}>
                      <Button
                        onClick={() => unlockDeposit?.()}
                        disabled={!unlockDeposit || isUnlocking}
                        loading={isUnlocking}
                        size="sm"
                      >
                        Unlock Position
                      </Button>
                    </Checker.Network>
                  </Checker.Connect>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <span className="text-xs font-normal text-gray-400">Composition</span>

          <div className="space-y-3">
            {assets.map((asset, index) => {
              const percentage = asset.weight * 100
              const assetValue = totalValue * asset.weight

              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {'stablecoin' in asset ? (
                      <>
                        <CurrencyFiatIcon width={18} height={18} />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-500">
                            USD
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Currency.Icon
                          currency={asset.token}
                          width={18}
                          height={18}
                        />
                        <span className="text-sm font-medium text-gray-500">
                          {asset.token.symbol}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-right">
                    <span className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                      {isLoading ? (
                        <SkeletonText className="w-12" />
                      ) : (
                        formatPercent(percentage / 100)
                      )}
                    </span>
                    <span className="text-sm font-normal text-gray-400">
                      {isLoading ? (
                        <SkeletonText className="w-16" />
                      ) : (
                        formatUSD(assetValue)
                      )}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {hasStablecoins && (
            <Button
              onClick={() => setShowStableTypes(!showStableTypes)}
              variant="link"
            >
              Show stablecoin types
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export const BladePoolPosition: FC<PoolPositionProps> = ({ pool }) => {
  const { address } = useAccount()

  if (!address) {
    return <PoolPositionDisconnected />
  }

  return <PoolPositionConnected pool={pool} />
}
