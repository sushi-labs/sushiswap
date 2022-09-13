import { formatUSD } from '@sushiswap/format'
import { Button, Currency, Typography, useBreakpoint } from '@sushiswap/ui'
import { Checker } from '@sushiswap/wagmi'
import { FC } from 'react'

import { Pair } from '../../.graphclient'
import { usePoolPositionRewards } from '../PoolPositionRewardsProvider'

interface PoolMyRewardsProps {
  pair: Pair
}

export const PoolMyRewards: FC<PoolMyRewardsProps> = ({ pair }) => {
  const { pendingRewards, rewardTokens, harvest, isError, values, isLoading, error } = usePoolPositionRewards()
  const { isLg } = useBreakpoint('lg')

  if (!isLg || !pair.farm) return <></>

  return (
    <div className="flex flex-col gap-3">
      <div className="flex bg-slate-800 flex flex-col rounded-2xl shadow-md shadow-black/30">
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200/5">
          <Typography weight={600} className="text-slate-50">
            My Rewards
          </Typography>
          <div className="flex flex-col">
            <Typography variant="sm" weight={600} className="text-slate-50 text-right">
              {formatUSD(values.reduce((sum, value) => sum + value, 0))}
            </Typography>
          </div>
        </div>
        <div className="flex flex-col px-5 py-4 gap-3">
          {pendingRewards?.map((reward, index) => {
            if (!reward && isLoading && !isError)
              return (
                <div className="justify-between grid gap-2 grid-cols-10" key={index}>
                  <div className="h-[20px] bg-slate-700 animate-pulse col-span-8 rounded-full" />
                  <div className="h-[20px] bg-slate-700 animate-pulse col-span-2 rounded-full" />
                </div>
              )

            return (
              <div className="flex justify-between items-center" key={index}>
                <div className="flex gap-2 items-center">
                  <Currency.Icon currency={rewardTokens[index]} width={20} height={20} />
                  <Typography variant="sm" weight={600} className="text-slate-300">
                    {reward?.toSignificant(6)} {rewardTokens[index].symbol}
                  </Typography>
                </div>
                <Typography variant="xs" weight={500} className="text-slate-400">
                  {formatUSD(values[index])}
                </Typography>
              </div>
            )
          })}
        </div>
      </div>
      <Checker.Connected fullWidth size="md">
        <Checker.Network fullWidth size="md" chainId={pair.chainId}>
          <Button size="md" fullWidth onClick={harvest}>
            Claim
          </Button>
        </Checker.Network>
      </Checker.Connected>
      {error && (
        <Typography variant="xs" className="text-center text-red mt-2" weight={500}>
          {error}
        </Typography>
      )}
    </div>
  )
}
