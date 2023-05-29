import React, { FC } from 'react'
import { classNames } from '@sushiswap/ui'
import { useAngleRewardsMultipleChains } from '@sushiswap/react-query'
import { ChainId } from '@sushiswap/chain'
import { Carousel } from '@sushiswap/ui/future/components/Carousel'
import { RewardSlide } from './RewardSlide'
import { useAccount } from 'wagmi'
import { RewardsSectionItem } from './RewardsSectionItem'
import Container from '@sushiswap/ui/future/components/Container'
import ConcentratedCurveIcon from '@sushiswap/ui/future/components/icons/ConcentratedCurveIcon'

export const RewardsSection: FC = () => {
  const { address } = useAccount()
  const { data } = useAngleRewardsMultipleChains({
    chainIds: [ChainId.POLYGON, ChainId.OPTIMISM],
    account: address,
  })

  return (
    <>
      <Container maxWidth="7xl" className="px-4 mx-auto">
        <div className={classNames('w-full group')}>
          <h1 className="flex items-center justify-between gap-2 px-4 py-4 text-sm font-semibold text-gray-700 group-hover:text-gray-900 dark:text-slate-200 dark:group-hover:text-slate-50">
            <span className="flex items-center gap-3">
              <ConcentratedCurveIcon id="rw" fill="black" width={20} height={20} className="saturate-200" /> SushiSwap
              V3 Rewards{' '}
            </span>
          </h1>
        </div>
      </Container>
      <Carousel
        containerWidth={1280}
        slides={data ?? []}
        render={(row) => <RewardSlide data={row} address={address} />}
      />
      <Container maxWidth="7xl" className="px-4 mx-auto">
        <div className="flex flex-col gap-4">
          {(data ?? []).map((el) => {
            return Object.values(el.pools ?? {})
              .filter((el) => +(el.userTVL ?? 0) > 0)
              .map((item) => {
                return <RewardsSectionItem chainId={el.chainId} data={item} />
              })
          })}
        </div>
      </Container>
    </>
  )
}
