import { SkeletonText } from '@sushiswap/ui'
import { formatUSD } from 'sushi'
import { useLPUsdValue } from '~stellar/_common/lib/hooks/pool/use-pool-usd-value'
import type { IPositionRowData } from './PositionsTable'

export const PositionValueCell = ({ data }: { data: IPositionRowData }) => {
  const { token0, token1, principalToken0, principalToken1 } = data
  const {
    data: totalLPUsdValue,
    isLoading,
    isPending,
  } = useLPUsdValue({
    token0,
    token1,
    reserve0: principalToken0,
    reserve1: principalToken1,
  })

  if (isLoading || isPending || Number.isNaN(totalLPUsdValue)) {
    return <SkeletonText fontSize="lg" />
  }

  const poolTvl = totalLPUsdValue ?? 0

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {formatUSD(poolTvl)}
        </span>
      </div>
    </div>
  )
}
