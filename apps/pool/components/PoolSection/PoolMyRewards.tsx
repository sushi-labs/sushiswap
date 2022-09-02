import { formatUSD } from '@sushiswap/format'
import { AppearOnMount, Button, Currency, Typography } from '@sushiswap/ui'
import { Checker, useFarmRewards } from '@sushiswap/wagmi'
import { FC, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { Pair } from '../../.graphclient'
import { CHEF_TYPE_MAP } from '../../lib/constants'
import { useTokensFromPair } from '../../lib/hooks'
import { StakedRewardsFetcher } from '../StakedRewardsFetcher'

interface PoolMyRewardsProps {
  pair: Pair
}

export const PoolMyRewards: FC<PoolMyRewardsProps> = ({ pair }) => {
  const { liquidityToken } = useTokensFromPair(pair)
  const { data: rewards } = useFarmRewards()
  const { address } = useAccount()

  const incentives = rewards?.[pair.chainId]?.farms[pair.id]?.incentives
  const farmId = rewards?.[pair.chainId]?.farms[pair.id]?.id
  const chefType = rewards?.[pair.chainId]?.farms[pair.id]?.chefType
    ? CHEF_TYPE_MAP[rewards?.[pair.chainId]?.farms[pair.id]?.chefType]
    : undefined

  return useMemo(() => {
    if (typeof farmId === 'undefined' || !incentives) return <></>

    return (
      <AppearOnMount>
        <div className="flex flex-col gap-3">
          <StakedRewardsFetcher
            account={address}
            chainId={pair.chainId}
            farmId={farmId}
            incentives={incentives}
            chefType={chefType}
            liquidityToken={liquidityToken}
          >
            {({ values, pendingRewards, isLoading, rewardTokens, harvest, error }) => (
              <>
                <div className="hidden lg:flex bg-slate-800 flex flex-col rounded-2xl shadow-md shadow-black/30">
                  <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200/5">
                    <Typography weight={600} className="text-slate-50">
                      My Rewards
                    </Typography>
                    <div className="flex flex-col">
                      <Typography variant="sm" weight={600} className="text-slate-50 text-right">
                        {isNaN(+formatUSD(Number(values.reduce((sum, value) => Number(sum) + Number(value), 0))))
                          ? '$0.00'
                          : formatUSD(Number(values.reduce((sum, value) => Number(sum) + Number(value), 0)))}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex flex-col px-5 py-4 gap-3">
                    {pendingRewards?.map((reward, index) => {
                      if (!reward && isLoading)
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
                            {isNaN(+formatUSD(Number(values[index]))) ? '$0.00' : formatUSD(Number(values[index]))}
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
              </>
            )}
          </StakedRewardsFetcher>
        </div>
      </AppearOnMount>
    )
  }, [address, chefType, farmId, incentives, liquidityToken, pair.chainId])
}
