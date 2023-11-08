import { Icon } from '@sushiswap/ui/components/currency/Icon'
import { FC } from 'react'
import { formatUSD } from 'sushi/format'
import { Pool } from 'utils/usePools'
import { useTokensFromPools } from 'utils/useTokensFromPool'

interface PoolPositionProps {
  row: Pool
  isLoading: boolean
  underlying0: string | undefined
  underlying1: string | undefined
  value0: number
  value1: number
}

export const PoolPositionDesktop: FC<PoolPositionProps> = ({
  row,
  isLoading,
  underlying0,
  underlying1,
  value0,
  value1,
}) => {
  const { token0, token1 } = useTokensFromPools(row)
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex justify-between mb-1 py-0.5">
          <div className="h-[16px] bg-slate-600 animate-pulse w-[100px] rounded-full" />
          <div className="h-[16px] bg-slate-600 animate-pulse w-[60px] rounded-full" />
        </div>
        <div className="flex justify-between py-0.5">
          <div className="h-[16px] bg-slate-700 animate-pulse w-[160px] rounded-full" />
          <div className="h-[16px] bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
        <div className="flex justify-between py-0.5">
          <div className="h-[16px] bg-slate-700 animate-pulse w-[160px] rounded-full" />
          <div className="h-[16px] bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-3 px-5 py-4">
      {
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm dark:text-slate-100 text-gray-900">
            Unstaked Position
          </span>
          <span className="text-sm dark:text-slate-100 text-gray-900">
            {formatUSD(value0 + value1)}
          </span>
        </div>
      }
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon currency={token0} width={20} height={20} />
          <span className="text-sm dark:text-slate-300 text-gray-700">
            {underlying0 ? Number(underlying0)?.toFixed(6) : 0} {token0.symbol}
          </span>
        </div>
        <span className="text-sm dark:text-slate-400 text-slate-600">
          {formatUSD(value0)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon currency={token1} width={20} height={20} />
          <span className="text-sm dark:text-slate-300 text-gray-700">
            {underlying1 ? Number(underlying1)?.toFixed(6) : 0} {token1.symbol}
          </span>
        </div>
        <span className="text-sm dark:text-slate-400 text-slate-600">
          {formatUSD(value1)}
        </span>
      </div>
    </div>
  )
}
