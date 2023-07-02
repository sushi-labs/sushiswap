import { Pool } from '@sushiswap/client'
import { formatUSD } from '@sushiswap/format'
import { useBreakpoint } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import { FC } from 'react'

import { usePoolPositionRewards } from '../PoolPositionRewardsProvider'

interface PoolMyRewardsProps {
  pool: Pool
}

export const PoolMyRewards: FC<PoolMyRewardsProps> = ({ pool }) => {
  const { pendingRewards, rewardTokens, harvest, isError, values, isLoading } = usePoolPositionRewards()
  const { isLg } = useBreakpoint('lg')

  if (!isLg || (!pool?.incentives?.length && !pendingRewards?.length)) return <></>

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-900/5 dark:border-slate-200/5">
          <p className="font-semibold  dark:text-slate-50 text-gray-900">My Rewards</p>
          <div className="flex flex-col">
            <p className="text-sm font-semibold  text-right dark:text-slate-50 text-gray-900">
              {formatUSD(values.reduce((sum, value) => sum + value, 0))}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 px-5 py-4">
          {pendingRewards?.map((reward, index) => {
            if (!reward && isLoading && !isError)
              return (
                <div className="grid justify-between grid-cols-10 gap-2" key={index}>
                  <div className="h-[20px] bg-slate-700 animate-pulse col-span-8 rounded-full" />
                  <div className="h-[20px] bg-slate-700 animate-pulse col-span-2 rounded-full" />
                </div>
              )

            return (
              <div className="flex items-center justify-between" key={index}>
                <div className="flex items-center gap-2">
                  <Currency.Icon currency={rewardTokens[index]} width={20} height={20} />
                  <p className="text-sm font-semibold  dark:text-slate-300 text-gray-700">
                    {reward?.toSignificant(6)} {rewardTokens[index].symbol}
                  </p>
                </div>
                <p className="text-xs font-medium dark:text-slate-400 text-slate-600 text-gray-600">
                  {formatUSD(values[index])}
                </p>
              </div>
            )
          })}
        </div>
      </div>
      <Checker.Connect fullWidth>
        <Checker.Network fullWidth chainId={pool.chainId}>
          <Button fullWidth onClick={harvest} size="lg">
            Claim
          </Button>
        </Checker.Network>
      </Checker.Connect>
    </div>
  )
}
