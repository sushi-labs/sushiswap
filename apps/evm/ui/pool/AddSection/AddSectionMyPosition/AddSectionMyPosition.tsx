import { ChainId } from '@sushiswap/chain'
import { Pool } from '@sushiswap/client'
import { formatPercent } from '@sushiswap/format'
import { classNames } from '@sushiswap/ui'
import { Currency as UICurrency } from '@sushiswap/ui/components/currency'
import { incentiveRewardToToken } from 'lib/functions'
import React, { FC } from 'react'

import { AddSectionMyPositionStaked } from './AddSectionMyPositionStaked'
import { AddSectionMyPositionUnstaked } from './AddSectionMyPositionUnstaked'

export const AddSectionMyPosition: FC<{ pool: Pool }> = ({ pool }) => {
  return (
    <div className="flex flex-col bg-white dark:bg-opacity-[0.04] rounded-2xl">
      <div className="flex flex-col gap-4 p-5">
        <div className="grid items-center grid-cols-2 gap-2">
          <p className="text-xs font-medium text-gray-700 dark:text-slate-300">Total APR:</p>
          <p className="text-xs font-medium text-right text-gray-700 dark:text-slate-300">
            {formatPercent(pool.feeApr1d + pool.incentiveApr)}
          </p>
          {pool.incentives && (
            <>
              <p className="text-xs font-medium text-gray-700 dark:text-slate-300">Fee APR:</p>
              <p className="text-xs font-medium text-right text-gray-700 dark:text-slate-300">
                {formatPercent(pool.feeApr1d)}
              </p>
              <p className="text-xs font-medium text-gray-700 dark:text-slate-300">Reward APR:</p>
              <p className="text-xs font-medium text-right text-gray-700 dark:text-slate-300">
                {/* Reward APR */}
                {formatPercent(pool.incentiveApr)}
              </p>
              <p className="text-xs font-medium text-gray-700 dark:text-slate-300">Farming Rewards:</p>
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
