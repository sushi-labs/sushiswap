import { formatUSD } from '@sushiswap/format'
import { Pool } from '@sushiswap/client'
import { Currency, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromPool } from '../../../lib/hooks'
import { usePoolPositionStaked } from '../../PoolPositionStakedProvider'

interface PoolPositionStakedDesktopProps {
  pool: Pool
}

export const PoolPositionStakedDesktop: FC<PoolPositionStakedDesktopProps> = ({ pool }) => {
  const { token0, token1 } = useTokensFromPool(pool)
  const { value1, value0, underlying1, underlying0, isLoading, isError } = usePoolPositionStaked()

  if (!pool.incentives) return <></>

  if (isLoading && !isError) {
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

  if (!isLoading && !isError)
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex items-center justify-between mb-1">
          <Typography variant="sm" weight={600} className="dark:text-slate-100 text-gray-900">
            Staked Position
          </Typography>
          <Typography variant="xs" weight={500} className="dark:text-slate-100 text-gray-900">
            {formatUSD(value0 + value1)}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Currency.Icon currency={token0} width={20} height={20} />
            <Typography variant="sm" weight={500} className="dark:text-slate-300 text-gray-700">
              {underlying0?.toSignificant(6)} {token0.symbol}
            </Typography>
          </div>
          <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600 text-gray-600">
            {formatUSD(value0)}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Currency.Icon currency={token1} width={20} height={20} />
            <Typography variant="sm" weight={500} className="dark:text-slate-300 text-gray-700">
              {underlying1?.toSignificant(6)} {token1.symbol}
            </Typography>
          </div>
          <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600 text-gray-600">
            {formatUSD(value1)}
          </Typography>
        </div>
      </div>
    )

  return <></>
}
