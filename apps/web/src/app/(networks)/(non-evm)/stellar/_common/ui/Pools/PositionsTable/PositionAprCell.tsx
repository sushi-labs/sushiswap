import { SkeletonText } from '@sushiswap/ui'
import { useMemo } from 'react'
import { formatPercent } from 'sushi/format'
import { useFeeRate } from '~stellar/_common/lib/hooks/useFeeRate'
import { useLPUsdValue } from '~stellar/_common/lib/hooks/useLPUsdValue'
import { useDayVolumeUSD } from '~stellar/_common/lib/hooks/useOneDayApr'
import { usePoolOwnership } from '~stellar/_common/lib/hooks/usePoolOwnership'
import type { IPositionRowData } from './PositionsTable'

export const PositionAprCell = ({ data }: { data: IPositionRowData }) => {
  const { pairAddress, token0, token1, reserve0, reserve1 } = data
  const {
    data: ownership,
    isPending: isPendingOwnership,
    isLoading: isLoadingOwnership,
  } = usePoolOwnership({
    pairAddress,
    token0,
    token1,
    reserve0,
    reserve1,
  })
  const proportionLpOwned = Number(ownership?.ownership ?? '0')
  const userLiquidityValue = Number(ownership?.ownedSupply ?? '0')
  const {
    data: dayVolumeUSD,
    isPending: isPendingDVol,
    isLoading: isLoadingDVol,
  } = useDayVolumeUSD({
    pairAddress,
  })
  const {
    data: feeRate,
    isPending: isPendingFeeRate,
    isLoading: isLoadingFeeRate,
  } = useFeeRate({
    pairAddress,
  })

  const apr = useMemo(() => {
    const totalDailyFees =
      (Number(feeRate ?? '0') / 1000000) * Number(dayVolumeUSD ?? 0)
    const annualizedFees = totalDailyFees * 365
    const userAnnualEarnings = annualizedFees * proportionLpOwned
    const apr =
      userLiquidityValue !== 0 ? userAnnualEarnings / userLiquidityValue : 0
    return apr
  }, [dayVolumeUSD, proportionLpOwned, userLiquidityValue, feeRate])

  if (
    isLoadingDVol ||
    isLoadingOwnership ||
    isLoadingFeeRate ||
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
