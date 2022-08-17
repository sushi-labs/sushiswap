import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { KashiPair } from '../../.graphclient'

interface MarketInformation {
  pair: KashiPair
}

export const MarketInformation: FC<MarketInformation> = () => {
  return (
    <div className="flex flex-col gap-3">
      <Typography weight={600} className="text-slate-200">
        Market Information
      </Typography>
      <div className="flex flex-col gap-1">
        <div className="px-6 py-2 grid grid-cols-3 rounded-t-lg bg-slate-800">
          <Typography variant="sm" weight={400} className="text-slate-400">
            LTV
          </Typography>
          <Typography variant="sm" weight={600} className="col-span-2 text-slate-300">
            90%
          </Typography>
        </div>
        <div className="px-6 py-2 grid grid-cols-3 bg-slate-800/60">
          <Typography variant="sm" weight={400} className="text-slate-400">
            Borrow APR
          </Typography>
          <Typography variant="sm" weight={600} className="col-span-2 text-slate-300">
            22.27%
          </Typography>
        </div>
        <div className="px-6 py-2 grid grid-cols-3 rounded-b-lg bg-slate-800">
          <Typography variant="sm" weight={400} className="text-slate-400">
            Liquidation Fee
          </Typography>
          <Typography variant="sm" weight={600} className="col-span-2 text-slate-300">
            0.9%
          </Typography>
        </div>
      </div>
    </div>
  )
}
