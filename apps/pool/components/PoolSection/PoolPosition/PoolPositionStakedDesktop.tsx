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

  if (isLoading && !isError) {
    return (
      <div className="flex flex-col py-4 gap-2 mt-2 px-5">
        <div className="flex justify-between mb-2">
          <div className="h-[20px] bg-slate-600 animate-pulse w-[100px] rounded-full" />
          <div className="h-[20px] bg-slate-600 animate-pulse w-[60px] rounded-full" />
        </div>
        <div className="flex justify-between">
          <div className="h-[20px] bg-slate-700 animate-pulse w-[160px] rounded-full" />
          <div className="h-[20px] bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
        <div className="flex justify-between">
          <div className="h-[20px] bg-slate-700 animate-pulse w-[160px] rounded-full" />
          <div className="h-[20px] bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
      </div>
    )
  }

  if (!isLoading && !isError)
    return (
      <div className="flex flex-col px-5 py-4 gap-3">
        <div className="flex justify-between items-center mb-1">
          <Typography variant="sm" weight={600} className="text-slate-100">
            Staked Position
          </Typography>
          <Typography variant="xs" weight={500} className="text-slate-100">
            {formatUSD(Number(value0) + Number(value1))}
          </Typography>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Currency.Icon currency={token0} width={20} height={20} />
            <Typography variant="sm" weight={500} className="text-slate-300">
              {underlying0?.toSignificant(6)} {token0.symbol}
            </Typography>
          </div>
          <Typography variant="xs" weight={500} className="text-slate-400">
            {formatUSD(Number(value0))}
          </Typography>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Currency.Icon currency={token1} width={20} height={20} />
            <Typography variant="sm" weight={500} className="text-slate-300">
              {underlying1?.toSignificant(6)} {token1.symbol}
            </Typography>
          </div>
          <Typography variant="xs" weight={500} className="text-slate-400">
            {formatUSD(Number(value1))}
          </Typography>
        </div>
      </div>
    )

  return <></>
}
