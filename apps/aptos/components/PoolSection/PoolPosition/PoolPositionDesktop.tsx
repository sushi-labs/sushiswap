import { Typography } from '@sushiswap/ui'
import { Icon } from 'components/Icon'
import { FC } from 'react'
import { Pool, usePools } from 'utils/usePools'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { formatNumber } from 'utils/utilFunctions'

interface PoolPositionProps {
  row: Pool
  isLoading: boolean
}

export const PoolPositionDesktop: FC<PoolPositionProps> = ({ row, isLoading }) => {
  const { token0, token1 } = useTokensFromPools(row)
  const balanceX = formatNumber(Number(row.data.balance_x.value), token0.decimals)
  const balanceY = formatNumber(Number(row.data.balance_y.value), token1.decimals)
  const {} = usePools()
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
  if (true) {
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        {
          <div className="flex items-center justify-between mb-1">
            <Typography variant="sm" weight={600} className="dark:text-slate-100 text-gray-900">
              Unstaked Position
            </Typography>
            <Typography variant="xs" weight={500} className="dark:text-slate-100 text-gray-900">
              {'$0.00'}
            </Typography>
          </div>
        }
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon currency={token0} width={20} height={20} />
            <Typography variant="sm" weight={600} className="dark:text-slate-300 text-gray-700">
              {balanceX} {token0.symbol}
            </Typography>
          </div>
          <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600 text-gray-600">
            {'$0.00'}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon currency={token1} width={20} height={20} />
            <Typography variant="sm" weight={600} className="dark:text-slate-300 text-gray-700">
              {balanceY} {token1.symbol}
            </Typography>
          </div>
          <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600 text-gray-600">
            {'$0.00'}
          </Typography>
        </div>
      </div>
    )
  }
  return <></>
}
