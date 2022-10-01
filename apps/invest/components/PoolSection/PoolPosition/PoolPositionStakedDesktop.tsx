import { formatUSD } from '@sushiswap/format'
import { Currency, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromPair } from '../../../lib/hooks'
import { PairWithAlias } from '../../../types'
import { usePoolPositionStaked } from '../../PoolPositionStakedProvider'

interface PoolPositionStakedDesktopProps {
  pair: PairWithAlias
}

export const PoolPositionStakedDesktop: FC<PoolPositionStakedDesktopProps> = ({ pair }) => {
  const { token0, token1 } = useTokensFromPair(pair)
  const { value1, value0, underlying1, underlying0, isLoading, isError } = usePoolPositionStaked()

  if (!pair.farm) return <></>

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

  console.log({ token0 })

  if (!isLoading && !isError)
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex items-center justify-between mb-1">
          <Typography variant="sm" weight={600} className="text-slate-100">
            Staked Position
          </Typography>
          <Typography variant="xs" weight={500} className="text-slate-100">
            {formatUSD(value0 + value1)}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Currency.Icon currency={token0} width={20} height={20} />
            <Typography variant="sm" weight={500} className="text-slate-300">
              {underlying0?.toSignificant(6)} {token0.symbol}
            </Typography>
          </div>
          <Typography variant="xs" weight={500} className="text-slate-400">
            {formatUSD(value0)}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Currency.Icon currency={token1} width={20} height={20} />
            <Typography variant="sm" weight={500} className="text-slate-300">
              {underlying1?.toSignificant(6)} {token1.symbol}
            </Typography>
          </div>
          <Typography variant="xs" weight={500} className="text-slate-400">
            {formatUSD(value1)}
          </Typography>
        </div>
      </div>
    )

  return <></>
}
