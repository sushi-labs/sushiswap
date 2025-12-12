import { SkeletonText } from '@sushiswap/ui'
import { formatPercent } from 'sushi'
import { usePoolOwnership } from '~stellar/_common/lib/hooks/usePoolOwnership'
import type { IPositionRowData } from './PositionsTable'

export const PositionSizeCell = ({ data }: { data: IPositionRowData }) => {
  const { pool } = data
  const { data: ownership, isLoading } = usePoolOwnership({
    pairAddress: pool,
    token0: data.token0,
    token1: data.token1,
    reserve0: data.principalToken0,
    reserve1: data.principalToken1,
  })

  if (isLoading || ownership === undefined) {
    return <SkeletonText fontSize="lg" />
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {formatPercent(Number(ownership.ownership))}
        </span>
      </div>
    </div>
  )
}
