import { formatPercent } from '@sushiswap/format'
import { classNames, Currency as UICurrency, Typography } from '@sushiswap/ui'
import React, { FC } from 'react'

import { usePoolFarmRewards } from '../../PoolFarmRewardsProvider'
import { AddSectionMyPositionStaked } from './AddSectionMyPositionStaked'
import { AddSectionMyPositionUnstaked } from './AddSectionMyPositionUnstaked'

export const AddSectionMyPosition: FC = () => {
  const { incentives, rewardAPR, totalAPR, feeAPR, isFarm } = usePoolFarmRewards()

  return (
    <div className="flex flex-col bg-white bg-opacity-[0.04] rounded-2xl">
      <div className="p-5 flex flex-col gap-4">
        <div className="grid grid-cols-2 items-center gap-2">
          <Typography variant="xs" weight={500} className="text-slate-300">
            Total APR:
          </Typography>
          <Typography variant="xs" weight={500} className="text-slate-300 text-right">
            {formatPercent(totalAPR)}
          </Typography>
          {isFarm && (
            <>
              <Typography variant="xs" weight={500} className="text-slate-300">
                Fee APR:
              </Typography>
              <Typography variant="xs" weight={500} className="text-slate-300 text-right">
                {formatPercent(feeAPR)}
              </Typography>
              <Typography variant="xs" weight={500} className="text-slate-300">
                Reward APR:
              </Typography>
              <Typography variant="xs" weight={500} className="text-slate-300 text-right">
                {formatPercent(rewardAPR)}
              </Typography>
              <Typography variant="xs" weight={500} className="text-slate-300">
                Farming Rewards:
              </Typography>
              <div className={classNames(incentives?.length === 2 ? '-mr-2' : '', 'flex justify-end ')}>
                <UICurrency.IconList iconWidth={16} iconHeight={16}>
                  {incentives?.map((incentive, index) => (
                    <UICurrency.Icon key={index} currency={incentive.rewardToken} />
                  ))}
                </UICurrency.IconList>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="px-5">
        <hr className="h-px border-t border-slate-200/5" />
      </div>
      <div className="p-5 space-y-5">
        <AddSectionMyPositionUnstaked />
        {isFarm && <AddSectionMyPositionStaked />}
      </div>
    </div>
  )
}
