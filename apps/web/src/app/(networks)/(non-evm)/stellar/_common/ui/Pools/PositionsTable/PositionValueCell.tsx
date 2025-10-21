import { SkeletonText } from '@sushiswap/ui'
import { formatUSD } from 'sushi/format'
import { useLPUsdValue } from '~stellar/_common/lib/hooks/useLPUsdValue'
import { usePoolOwnership } from '~stellar/_common/lib/hooks/usePoolOwnership'
import type { IPositionRowData } from './PositionsTable'

export const PositionValueCell = ({ data }: { data: IPositionRowData }) => {
  const { token0, token1, reserve0, reserve1, pairAddress } = data
  const {
    data: ownership,
    isLoading: _isLoading,
    isPending: _isPending,
  } = usePoolOwnership({
    pairAddress,
  })
  const {
    data: totalLPUsdValue,
    isLoading,
    isPending,
  } = useLPUsdValue({
    token0,
    token1,
    reserve0,
    reserve1,
  })

  if (
    isLoading ||
    _isLoading ||
    isPending ||
    _isPending ||
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
