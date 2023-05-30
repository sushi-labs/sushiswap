import React, { FC } from 'react'
import { useAngleRewardsMultipleChains } from '@sushiswap/react-query'
import { ChainId } from '@sushiswap/chain'
import { Carousel } from '@sushiswap/ui/future/components/Carousel'
import { RewardSlide } from './RewardSlide'
import { useAccount } from 'wagmi'
import { RewardsSectionItem } from './RewardsSectionItem'
import Container from '@sushiswap/ui/future/components/Container'

export const RewardsSection: FC = () => {
  const { address } = useAccount()
  const { data } = useAngleRewardsMultipleChains({
    chainIds: [ChainId.POLYGON],
    account: address,
  })

  return (
    <>
      <div className="pl-4 xl:pl-2">
        <Carousel
          containerWidth={1280}
          slides={data ?? []}
          render={(row) => <RewardSlide data={row} address={address} />}
        />
      </div>
      <Container maxWidth="7xl" className="px-4 mx-auto mb-[120px]">
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
