import { SkeletonText } from '@sushiswap/ui'
import { formatPercent } from 'sushi'
import { usePoolOwnership } from '~tron/_common/lib/hooks/use-pool-ownership'
import type { IPositionRowData } from './positions-table'

export const PositionSizeCell = ({ data }: { data: IPositionRowData }) => {
  const { pairAddress } = data
  const { data: ownership, isLoading } = usePoolOwnership({ pairAddress })

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
