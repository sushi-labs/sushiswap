import { formatNumber, formatPercent } from '@sushiswap/format'
import { Pool } from '@sushiswap/client'
import { Currency } from '@sushiswap/ui'
import React, { FC } from 'react'

import { incentiveRewardToToken } from '../../lib/functions'
import { ChainId } from '@sushiswap/chain'
import { List } from '@sushiswap/ui/future/components/list/List'

export const PoolRewards: FC<{ pool: Pool }> = ({ pool }) => {
  if (!pool?.incentives?.length) return <></>

  return (
    <List>
      <div className="flex items-center justify-between">
        <List.Label>Pool Rewards</List.Label>
        <List.Label>Reward APR: {pool.incentiveApr > 0 ? formatPercent(pool.incentiveApr) : 'n/a'}</List.Label>
      </div>
      <List.Control>
        {pool.incentives.map((incentive, i) => (
          <List.KeyValue key={i} flex title={`${incentive.rewardToken.symbol}`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Currency.Icon
                  currency={incentiveRewardToToken(pool.chainId as ChainId, incentive)}
                  width={18}
                  height={18}
                />
                {formatNumber(incentive.rewardPerDay)} {incentive.rewardToken.symbol} per day
              </div>
            </div>
          </List.KeyValue>
        ))}
      </List.Control>
    </List>
  )
}
