import { ExchangeTypes } from '../../.graphclient'
import Pair = ExchangeTypes.Pair
import { Native } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { usePrices } from '@sushiswap/wagmi'
import { FC } from 'react'

interface PoolStats {
  pair: Pair
}

// TODO Volume (1d) Fees (1d) Transactions (1d)
export const PoolStats: FC<PoolStats> = ({ pair }) => {
  const { data: prices } = usePrices({ chainId: pair.chainId })
  const nativePrice = prices?.[Native.onChain(pair.chainId).wrapped.address]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="flex flex-col gap-1 rounded-md bg-slate-800 shadow-md shadow-black/20 p-3">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Liquidity
        </Typography>
        <Typography weight={500} className="text-slate-50">
          {formatUSD(pair.reserveETH * Number(nativePrice?.toFixed(4)))}
        </Typography>
        <Typography variant="xs" weight={500} className="text-green">
          +3.42%
        </Typography>
      </div>
      <div className="flex flex-col gap-1 rounded-md bg-slate-800 shadow-md shadow-black/20 p-3">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Volume (1d)
        </Typography>
        <Typography weight={500} className="text-slate-50">
          $128,890,325
        </Typography>
        <Typography variant="xs" weight={500} className="text-green">
          +3.42%
        </Typography>
      </div>
      <div className="flex flex-col gap-1 rounded-md bg-slate-800 shadow-md shadow-black/20 p-3">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Fees (1d)
        </Typography>
        <Typography weight={500} className="text-slate-50">
          $128,890,325
        </Typography>
        <Typography variant="xs" weight={500} className="text-green">
          +3.42%
        </Typography>
      </div>
      <div className="flex flex-col gap-1 rounded-md bg-slate-800 shadow-md shadow-black/20 p-3">
        <Typography variant="xs" weight={500} className="text-slate-400">
          Transactions (1d)
        </Typography>
        <Typography weight={500} className="text-slate-50">
          $128,890,325
        </Typography>
        <Typography variant="xs" weight={500} className="text-green">
          +3.42%
        </Typography>
      </div>
    </div>
  )
}
