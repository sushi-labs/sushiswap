import { formatNumber } from '@sushiswap/format'
import { Chip, Currency, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { Pair } from '../../.graphclient'
import { useTokensFromPair } from '../../lib/hooks'

interface PoolHeader {
  pair: Pair
}

export const PoolHeader: FC<PoolHeader> = ({ pair }) => {
  const [token0, token1] = useTokensFromPair(pair)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div className="flex">
          <Currency.IconList iconWidth={44} iconHeight={44}>
            <Currency.Icon currency={token0} />
            <Currency.Icon currency={token1} />
          </Currency.IconList>
          <div className="flex flex-col">
            <div className="flex gap-2 items-center">
              <Typography variant="lg" className="text-slate-50" weight={700}>
                {token0.symbol}/{token1.symbol}
              </Typography>
              <Chip color="gray" label="0.05%" className="text-slate-50 font-medium" />
            </div>
            <Typography variant="sm" weight={500} className="text-slate-400">
              Classic Pool
            </Typography>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Typography weight={400} as="span" className="text-slate-400 text-right">
            APY: <span className="font-bold text-slate-50">22.27%</span>
          </Typography>
          <div className="flex gap-2">
            <Typography variant="sm" weight={400} as="span" className="text-slate-400">
              Rewards: 12%
            </Typography>
            <Typography variant="sm" weight={400} as="span" className="text-slate-400">
              Fees: 10.27%
            </Typography>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex gap-3 rounded-lg bg-slate-800 p-3">
          <Currency.Icon currency={token0} width={20} height={20} />
          <Typography variant="sm" weight={600} className="text-slate-300">
            1 {token0.symbol} = {formatNumber(pair.reserve1 / pair.reserve0)} {token1.symbol}
          </Typography>
        </div>
        <div className="flex gap-3 rounded-lg bg-slate-800 p-3">
          <Currency.Icon currency={token1} width={20} height={20} />
          <Typography variant="sm" weight={600} className="text-slate-300">
            1 {token1.symbol} = {formatNumber(pair.reserve0 / pair.reserve1)} {token0.symbol}
          </Typography>
        </div>
      </div>
    </div>
  )
}
