import { getAddress } from '@ethersproject/address'
import { ChainId, Token } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import DoubleCurrencyLogo from 'app/components/DoubleLogo'
import Typography from 'app/components/Typography'
import UserTable from 'app/features/user/UserTable'
import { formatNumber, formatPercent } from 'app/functions'
import useFarmRewards from 'app/hooks/useFarmRewards'
import useFarmRewardsWithUsers from 'app/hooks/useFarmRewardsWithUsers'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import useActiveWeb3React from 'app/lib/hooks/useActiveWeb3React'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'

export default function Pool() {
  const router = useRouter()
  const id = (router.query.id as string).toLowerCase()
  const [farm, setFarm] = useState<any>(null)
  const [token0, setToken0] = useState<any>(null)
  const [token1, setToken1] = useState<any>(null)
  const { chainId } = useActiveWeb3React()
  const pools = useFarmRewardsWithUsers({ chainId: chainId || ChainId.ETHEREUM, variables: { where: { pair: id } } })
  console.log('pools', pools)
  const rewards = useFarmRewards({
    chainId,
  })

  useEffect(() => {
    const reward = rewards.find((reward) => reward.pair.id === id)
    console.log(reward)
    setFarm(reward)
  }, [id, rewards])

  useEffect(() => {
    if (farm) {
      const token0 = new Token(
        chainId || ChainId.ETHEREUM,
        getAddress(farm?.pair?.token0?.id),
        Number(farm?.pair?.token0?.decimals) || 18,
        farm?.pair?.token0?.symbol,
        farm?.pair?.token0?.name
      )

      const token1 = new Token(
        chainId || ChainId.ETHEREUM,
        getAddress(farm?.pair?.token1?.id),
        Number(farm?.pair?.token1?.decimals) || 18,
        farm?.pair?.token1?.symbol,
        farm?.pair?.token0?.name
      )
      setToken0(token0)
      setToken1(token1)
    }
  }, [chainId, farm])

  return (
    <>
      <NextSeo title={`${token0?.symbol}/${token1?.symbol} Analytics`} />
      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <DoubleCurrencyLogo className="rounded-full" currency0={token0} currency1={token1} size={60} />
            <Typography variant="h2" className="text-high-emphesis" weight={700}>
              {token0?.symbol}/{token1?.symbol}
            </Typography>
          </div>
          <Typography variant="sm" weight={400}>
            Dive deeper in the analytics of {token0?.symbol}/{token1?.symbol}.
          </Typography>
        </div>
        <div className="flex flex-row space-x-8">
          <div className="flex flex-col">
            <div className="text-secondary">TVL</div>
            <div className="flex items-center space-x-2">
              <div className="text-xl font-medium text-high-emphesis">{formatNumber(farm?.tvl ?? 0, true)}</div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-secondary">Rewards</div>
            <div className="flex items-center space-x-2">
              {farm?.rewards?.map((reward: any, i: number) => (
                <div className="flex items-center gap-1 text-xl font-medium text-high-emphesis" key={i}>
                  <span>{formatNumber(reward.rewardPerDay)}</span>
                  <CurrencyLogo currency={reward.currency} size={20} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-secondary">APR</div>
            <div className="flex items-center space-x-2">
              <div className="text-xl font-medium text-high-emphesis">
                {farm?.tvl !== 0
                  ? farm?.roiPerYear > 10000
                    ? '>10,000%'
                    : formatPercent(farm?.roiPerYear * 100)
                  : 'Infinite'}
              </div>
            </div>
          </div>
        </div>
      </TridentHeader>
      <TridentBody>
        <Typography variant="h3" weight={700}>
          Liquidity Providers
        </Typography>
        <UserTable chainId={chainId || ChainId.ETHEREUM} users={pools && pools.length > 0 ? pools[0].users : []} />
      </TridentBody>
    </>
  )
}
