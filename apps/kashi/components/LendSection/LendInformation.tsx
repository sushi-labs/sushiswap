import { formatPercent } from '@sushiswap/format'
import { JSBI } from '@sushiswap/math'
import { Typography } from '@sushiswap/ui'
import { formatDistance } from 'date-fns'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import { FC } from 'react'

interface LendInformation {
  pair: KashiMediumRiskLendingPairV1
}

export const LendInformation: FC<LendInformation> = ({ pair }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-800">
      <div className="flex justify-between">
        <Typography variant="sm" weight={600} className="text-slate-100">
          Supply APY
        </Typography>
        <Typography variant="sm" weight={600} className="text-slate-100">
          {pair.currentSupplyAPR.toSignificant(4)}%
        </Typography>
      </div>
      <hr className="w-full h-px my-3 border-t border-slate-200/10" />
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <Typography variant="xs" weight={500} className="text-slate-300">
            Utilization:
          </Typography>
          <Typography variant="xs" weight={500} className="text-slate-300">
            {formatPercent(JSBI.toNumber(pair.utilization) / 1e18)}
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="xs" weight={500} className="text-slate-300">
            Last accrual:
          </Typography>
          <Typography variant="xs" weight={500} className="text-slate-300">
            {formatDistance(JSBI.toNumber(pair.accrueInfo.lastAccrued), Date.now() / 1000)} ago
          </Typography>
        </div>
      </div>
    </div>
  )
}
