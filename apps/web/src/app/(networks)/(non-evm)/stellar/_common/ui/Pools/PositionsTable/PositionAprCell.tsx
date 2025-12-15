import { SkeletonText } from '@sushiswap/ui'
import { useMemo } from 'react'
import { formatPercent } from 'sushi'
import { usePoolInfo } from '~stellar/_common/lib/hooks'
import { useDayVolumeUSD } from '~stellar/_common/lib/hooks/pool/use-pool-daily-volume-usd'
import { usePositionActiveLiquidity } from '~stellar/_common/lib/hooks/position/use-position-active-liquidity'
import { usePoolOwnership } from '~stellar/_common/lib/hooks/position/use-position-pool-ownership'
import type { IPositionRowData } from './PositionsTable'

export const PositionAprCell = ({ data }: { data: IPositionRowData }) => {
  const {
    pool,
    token0,
    token1,
    principalToken0,
    principalToken1,
    tickLower,
    tickUpper,
  } = data
  const {
    data: ownership,
    isPending: isPendingOwnership,
    isLoading: isLoadingOwnership,
  } = usePoolOwnership({
    pairAddress: pool,
    token0,
    token1,
    reserve0: principalToken0,
    reserve1: principalToken1,
  })
  const {
    data: poolInfo,
    isLoading: isLoadingPoolInfo,
    isPending: isPendingPoolInfo,
  } = usePoolInfo(pool ?? null)
  const {
    data: positionActiveLiquidityOwned,
    isLoading: isLoadingPositionActiveLiquidityOwned,
    isPending: isPendingPositionActiveLiquidityOwned,
  } = usePositionActiveLiquidity({
    poolAddress: pool,
    scaledAmount0: principalToken0,
    scaledAmount1: principalToken1,
    tickLower,
    tickUpper,
  })
  const proportionActiveLiquidityOwned = useMemo(() => {
    if (
      !poolInfo ||
      !positionActiveLiquidityOwned ||
      Number(poolInfo.liquidity.amount) === 0
    ) {
      return 0
    }
    return (
      Number(positionActiveLiquidityOwned) / Number(poolInfo.liquidity.amount)
    )
  }, [poolInfo, positionActiveLiquidityOwned])

  const userLiquidityValueUsd = Number(ownership?.ownedSupplyUsd ?? '0')
  const {
    data: dayVolumeUSD,
    isPending: isPendingDayVol,
    isLoading: isLoadingDayVol,
  } = useDayVolumeUSD({
    pairAddress: pool,
  })

  const apr = useMemo(() => {
    const totalDailyFeesUsd =
      ((poolInfo?.fee ?? 0) / 1000000) * Number(dayVolumeUSD ?? 0)
    const annualizedFeesUsd = totalDailyFeesUsd * 365
    const userAnnualEarningsUsd =
      annualizedFeesUsd * proportionActiveLiquidityOwned
    const apr =
      userLiquidityValueUsd !== 0
        ? userAnnualEarningsUsd / userLiquidityValueUsd
        : 0
    return apr
  }, [
    dayVolumeUSD,
    proportionActiveLiquidityOwned,
    userLiquidityValueUsd,
    poolInfo,
  ])

  if (
    isLoadingPoolInfo ||
    isLoadingPositionActiveLiquidityOwned ||
    isLoadingDayVol ||
    isLoadingOwnership ||
    isPendingPoolInfo ||
    isPendingPositionActiveLiquidityOwned ||
    isPendingDayVol ||
    isPendingOwnership
  ) {
    return <SkeletonText fontSize="lg" />
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {formatPercent(apr)}
        </span>
      </div>
    </div>
  )
}
