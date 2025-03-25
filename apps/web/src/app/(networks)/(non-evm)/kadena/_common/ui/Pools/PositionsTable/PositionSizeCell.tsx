import { SkeletonText } from '@sushiswap/ui'
import { useEffect, useState } from 'react'
import { formatPercent } from 'sushi/format'
import type { IPositionRowData } from './PositionsTable'

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export const PositionSizeCell = ({ data }: { data: IPositionRowData }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1200)
  }, [])

  const ownership = {
    ownership: '.12',
    ownedSupply: '2.4',
  }
  if (isLoading || ownership === undefined) {
    return <SkeletonText fontSize="lg" />
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {formatPercent(ownership?.ownership)}
        </span>
      </div>
    </div>
  )
}
