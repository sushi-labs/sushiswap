import { SkeletonText } from '@sushiswap/ui'
import { useMemo } from 'react'
import { formatPercent } from 'sushi'
import { usePoolLiquidity } from '~stellar/_common/lib/hooks'
import { usePositionActiveLiquidity } from '~stellar/_common/lib/hooks/position/use-position-active-liquidity'
import { useFeeRate } from '~stellar/_common/lib/hooks/useFeeRate'
import { useDayVolumeUSD } from '~stellar/_common/lib/hooks/useOneDayApr'
import { usePoolOwnership } from '~stellar/_common/lib/hooks/usePoolOwnership'
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
    data: poolLiquidity,
    isLoading: isLoadingPoolLiquidity,
    isPending: isPendingPoolLiquidity,
  } = usePoolLiquidity(pool ?? null)
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
      !poolLiquidity ||
      !positionActiveLiquidityOwned ||
      Number(poolLiquidity.amount) === 0
    ) {
      return 0
    }
    return Number(positionActiveLiquidityOwned) / Number(poolLiquidity.amount)
  }, [poolLiquidity, positionActiveLiquidityOwned])

  const userLiquidityValueUsd = Number(ownership?.ownedSupplyUsd ?? '0')
  const {
    data: dayVolumeUSD,
    isPending: isPendingDVol,
    isLoading: isLoadingDVol,
  } = useDayVolumeUSD({
    pairAddress: pool,
  })
  const {
    data: feeRate,
    isPending: isPendingFeeRate,
    isLoading: isLoadingFeeRate,
  } = useFeeRate({
    pairAddress: pool,
  })

  const apr = useMemo(() => {
    const totalDailyFeesUsd =
      (Number(feeRate ?? '0') / 1000000) * Number(dayVolumeUSD ?? 0)
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
    feeRate,
  ])

  if (
    isLoadingPoolLiquidity ||
    isLoadingPositionActiveLiquidityOwned ||
    isLoadingDVol ||
    isLoadingOwnership ||
    isLoadingFeeRate ||
    isPendingPoolLiquidity ||
    isPendingPositionActiveLiquidityOwned ||
    isPendingDVol ||
    isPendingOwnership ||
    isPendingFeeRate
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
