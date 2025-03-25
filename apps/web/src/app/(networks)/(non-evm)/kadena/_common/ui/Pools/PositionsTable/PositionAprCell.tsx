import { SkeletonText } from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
import { formatPercent } from 'sushi/format'
import type { IPositionRowData } from './PositionsTable'

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export const PositionAprCell = ({ data }: { data: IPositionRowData }) => {
  const [isLoadingOwnership, setIsLoadingOwnership] = useState(true)
  const [isLoadingDVol, setIsLoadingDVol] = useState(true)
  const [isLoadingLPV, setIsLoadingLPV] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingOwnership(false)
      setIsLoadingDVol(false)
      setIsLoadingLPV(false)
    }, 1200)
  }, [])

  const ownership = {
    ownership: '1.2',
    ownedSupply: '2.4',
  }
  const ownedLp = Number(ownership?.ownership) ?? 0
  const ownedLpTokens = Number(ownership?.ownedSupply) ?? 0

  const dayVolumeUSD = 12345
  const totalLPUsdValue = 3600

  // @TODO - remove once deps are non-static values
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const apr = useMemo(() => {
    const totalDailyFees = 0.003 * Number(dayVolumeUSD ?? 0)
    const annualizedFees = totalDailyFees * 365
    const userAnnualEarnings = annualizedFees * ownedLp
    const userLiquidityValue = ownedLpTokens * (totalLPUsdValue ?? 0)
    const _apr = userAnnualEarnings / userLiquidityValue
    return Number.isNaN(_apr) ? 0 : _apr
  }, [ownedLpTokens])

  if (isLoadingLPV || isLoadingDVol || isLoadingOwnership) {
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
