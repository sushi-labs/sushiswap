'use client'

import { Pool } from '@sushiswap/client'
import { formatUSD } from '@sushiswap/format'
import { List } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import { FC } from 'react'

import { usePoolPositionRewards } from './PoolPositionRewardsProvider'

interface PoolMyRewardsProps {
  pool: Pool
}

export const PoolMyRewards: FC<PoolMyRewardsProps> = ({ pool }) => {
  const { pendingRewards, rewardTokens, harvest, isError, values, isLoading } = usePoolPositionRewards()

  if (!pool?.incentives?.length && !pendingRewards?.length) return <span></span>

  return (
    <div className="flex flex-col gap-3">
      <List className="!pt-0">
        <div className="flex items-center justify-between">
          <List.Label>My Rewards</List.Label>
        </div>
        <List.Control>
          {pendingRewards.length > 0 ? (
            pendingRewards.map((reward, index) => {
              if (!reward && isLoading && !isError) return <List.KeyValue skeleton />

              return (
                <List.KeyValue key={index} flex title={`${rewardTokens[index].symbol}`}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Currency.Icon currency={rewardTokens[index]} width={18} height={18} />
                      {reward?.toSignificant(6)} {rewardTokens[index].symbol}{' '}
                      <span className="text-muted-foreground">{formatUSD(values[index])}</span>
                    </div>
                  </div>
                </List.KeyValue>
              )
            })
          ) : (
            <div className="flex items-center justify-center p-6 text-xs font-normal text-center text-gray-500 dark:text-slate-500">
              This pool only emits fee rewards.
            </div>
          )}
        </List.Control>
      </List>
      <Checker.Connect size="default" fullWidth>
        <Checker.Network size="default" fullWidth chainId={pool.chainId}>
          <Button fullWidth onClick={harvest} size="default">
            Claim
          </Button>
        </Checker.Network>
      </Checker.Connect>
    </div>
  )
}
