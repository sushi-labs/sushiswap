import { formatPercent } from '@sushiswap/format'
import { Currency as UICurrency, Typography } from '@sushiswap/ui'
import { useFarmRewards } from '@sushiswap/wagmi'
import { FC } from 'react'

import { PairWithAlias } from '../../types'

interface AddSectionStepperProps {
  pair: PairWithAlias
}

export const AddSectionStepper: FC<AddSectionStepperProps> = ({ pair }) => {
  const { data: rewards } = useFarmRewards()

  const incentives = rewards?.[pair.chainId]?.farms[pair.id]?.incentives
  const rewardAPR = (incentives?.reduce((acc, cur) => acc + (cur.apr || 0), 0) || 0) / 100
  const totalAPR = rewardAPR + pair.apr / 100

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <Typography variant="xs" weight={500} className="text-slate-300">
          Fee APR:
        </Typography>
        <Typography variant="xs" weight={500} className="text-slate-300 text-right">
          {formatPercent(pair.apr / 100)}
        </Typography>
        <Typography variant="xs" weight={500} className="text-slate-300">
          Reward APR:
        </Typography>
        <Typography variant="xs" weight={500} className="text-slate-300 text-right">
          {formatPercent(rewardAPR)}
        </Typography>
        <Typography variant="xs" weight={500} className="text-slate-300">
          Total APR:
        </Typography>
        <Typography variant="xs" weight={500} className="text-slate-300 text-right">
          {formatPercent(totalAPR)}
        </Typography>
        <Typography variant="xs" weight={500} className="text-slate-300">
          Farming Rewards:
        </Typography>
        <div className="flex justify-end">
          <UICurrency.IconList iconWidth={20} iconHeight={20}>
            {incentives?.map((incentive, index) => (
              <UICurrency.Icon key={index} currency={incentive.rewardToken} />
            ))}
          </UICurrency.IconList>
        </div>
      </div>
    </div>
  )
}
