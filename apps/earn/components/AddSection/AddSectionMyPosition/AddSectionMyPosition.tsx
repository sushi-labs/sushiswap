import { formatPercent } from '@sushiswap/format'
import { Pool } from '@sushiswap/client'
import { classNames, Currency as UICurrency, Typography } from '@sushiswap/ui'
import React, { FC } from 'react'

import { incentiveRewardToToken } from '../../../lib/functions'
import { AddSectionMyPositionStaked } from './AddSectionMyPositionStaked'
import { AddSectionMyPositionUnstaked } from './AddSectionMyPositionUnstaked'
import { ChainId } from '@sushiswap/chain'

export const AddSectionMyPosition: FC<{ pool: Pool }> = ({ pool }) => {
  return (
    <div className="flex flex-col bg-white dark:bg-opacity-[0.04] rounded-2xl">
      <div className="flex flex-col gap-4 p-5">
        <div className="grid items-center grid-cols-2 gap-2">
          <Typography variant="xs" weight={500} className="text-gray-700 dark:text-slate-300">
            Total APR:
          </Typography>
          <Typography variant="xs" weight={500} className="text-right text-gray-700 dark:text-slate-300">
            {formatPercent(pool.feeApr1d + pool.incentiveApr)}
          </Typography>
          {pool.incentives && (
            <>
              <Typography variant="xs" weight={500} className="text-gray-700 dark:text-slate-300">
                Fee APR:
              </Typography>
              <Typography variant="xs" weight={500} className="text-right text-gray-700 dark:text-slate-300">
                {formatPercent(pool.feeApr1d)}
              </Typography>
              <Typography variant="xs" weight={500} className="text-gray-700 dark:text-slate-300">
                Reward APR:
              </Typography>
              <Typography variant="xs" weight={500} className="text-right text-gray-700 dark:text-slate-300">
                {/* Reward APR */}
                {formatPercent(pool.incentiveApr)}
              </Typography>
              <Typography variant="xs" weight={500} className="text-gray-700 dark:text-slate-300">
                Farming Rewards:
              </Typography>
              <div className={classNames(pool.incentives?.length === 2 ? '-mr-2' : '', 'flex justify-end ')}>
                <UICurrency.IconList iconWidth={16} iconHeight={16}>
                  {pool.incentives?.map((incentive) => (
                    <UICurrency.Icon
                      key={incentive.id}
                      currency={incentiveRewardToToken(pool.chainId as ChainId, incentive)}
                    />
                  ))}
                </UICurrency.IconList>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="px-5">
        <hr className="h-px border-t dark:border-slate-200/5 border-gray-900/5" />
      </div>
      <div className="p-5 space-y-5">
        <AddSectionMyPositionUnstaked />
        {pool.incentives && <AddSectionMyPositionStaked />}
      </div>
    </div>
  )
}
