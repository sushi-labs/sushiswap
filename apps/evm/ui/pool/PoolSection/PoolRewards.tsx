import { ChainId } from '@sushiswap/chain'
import { Pool } from '@sushiswap/client'
import { formatNumber, formatPercent } from '@sushiswap/format'
import { Currency } from '@sushiswap/ui/components/currency'
import { List } from '@sushiswap/ui/components/list/List'
import { incentiveRewardToToken } from 'lib/functions'
import React, { FC } from 'react'

export const PoolRewards: FC<{ pool: Pool }> = ({ pool }) => {
  if (!pool?.incentives?.length) return <></>

  return (
    <List>
      <div className="flex items-center justify-between">
        <List.Label>Pool Rewards</List.Label>
        <List.Label>Reward APR: {pool.incentiveApr > 0 ? formatPercent(pool.incentiveApr) : 'n/a'}</List.Label>
      </div>
      <List.Control>
        {pool.incentives
          .filter((incentive) => incentive.rewardPerDay > 0)
          .map((incentive) => (
            <List.KeyValue key={incentive.id} flex title={`${incentive.rewardToken.symbol}`}>
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
