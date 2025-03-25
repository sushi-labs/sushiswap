import { SkeletonText } from '@sushiswap/ui'
import { useEffect, useState } from 'react'
import { formatUSD } from 'sushi/format'
import type { IPositionRowData } from './PositionsTable'

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export const PositionValueCell = ({ data }: { data: IPositionRowData }) => {
  const [isLoadingOwnership, setIsLoadingOwnership] = useState(true)
  const [isPendingOwnership, setIsPendingOwnership] = useState(true)
  const [isLoadingLPUsdValue, setIsLoadingLPUsdValue] = useState(true)
  const [isPendingLPUsdValue, setIsPendingLPUsdValue] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingOwnership(false)
      setIsPendingOwnership(false)
      setIsLoadingLPUsdValue(false)
      setIsPendingLPUsdValue(false)
    }, 1200)
  }, [])

  const totalLPUsdValue = 3600

  const ownership = {
    ownership: '1.2',
    ownedSupply: '2.4',
  }

  if (
    isLoadingLPUsdValue ||
    isLoadingOwnership ||
    isPendingLPUsdValue ||
    isPendingOwnership ||
    Number.isNaN(totalLPUsdValue) ||
    ownership === undefined
  ) {
    return <SkeletonText fontSize="lg" />
  }

  const poolTvl = (totalLPUsdValue ?? 0) * (Number(ownership?.ownership) ?? 0)

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {formatUSD(Number.isNaN(poolTvl) ? 0 : poolTvl)}
        </span>
      </div>
    </div>
  )
}
