import { formatPercent } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { KashiPair } from '../../.graphclient'

interface LendInformation {
  pair: KashiPair
}

export const LendInformation: FC<LendInformation> = ({ pair }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-800">
      <div className="flex justify-between">
        <Typography variant="sm" weight={600} className="text-slate-100">
          Lend APY
        </Typography>
        <Typography variant="sm" weight={600} className="text-slate-100">
          {formatPercent(pair.supplyAPR / 1e18)}
        </Typography>
      </div>
      <hr className="border-t border-slate-200/10 h-px w-full my-3" />
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <Typography variant="xs" weight={500} className="text-slate-300">
            Avg APY:
          </Typography>
          <Typography variant="xs" weight={500} className="text-slate-300">
            7%
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="xs" weight={500} className="text-slate-300">
            Lowest APY:
          </Typography>
          <Typography variant="xs" weight={500} className="text-slate-300">
            0.5%
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="xs" weight={500} className="text-slate-300">
            Highest APY:
          </Typography>
          <Typography variant="xs" weight={500} className="text-slate-300">
            11%
          </Typography>
        </div>
      </div>
    </div>
  )
}
