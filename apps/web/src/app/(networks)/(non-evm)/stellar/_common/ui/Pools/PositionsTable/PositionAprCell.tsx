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
  const { data: ownership, isLoading: isLoadingOwnership } = usePoolOwnership({
    pairAddress,
    token0,
    token1,
    reserve0,
    reserve1,
  })
  const ownedLp = Number(ownership?.ownership) ?? 0
  const ownedLpTokens = Number(ownership?.ownedSupply) ?? 0
  const { data: dayVolumeUSD, isLoading: isLoadingDVol } = useDayVolumeUSD({
    pairAddress,
  })
  const { data: totalLPUsdValue, isLoading: isLoadingLPV } = useLPUsdValue({
    token0,
    token1,
    reserve0,
    reserve1,
  })
  const { data: feeRate, isLoading: isLoadingFeeRate } = useFeeRate({
    pairAddress,
  })

  const apr = useMemo(() => {
    const totalDailyFees = Number(feeRate ?? '0') * Number(dayVolumeUSD ?? 0)
    const annualizedFees = totalDailyFees * 365
    const userAnnualEarnings = annualizedFees * ownedLp
    const userLiquidityValue = ownedLpTokens * (totalLPUsdValue ?? 0)
    const _apr = userAnnualEarnings / userLiquidityValue
    return Number.isNaN(_apr) ? 0 : _apr
  }, [dayVolumeUSD, totalLPUsdValue, ownedLp, ownedLpTokens, feeRate])

  if (isLoadingLPV || isLoadingDVol || isLoadingOwnership || isLoadingFeeRate) {
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
