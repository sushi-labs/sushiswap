import React, { FC, useMemo } from 'react'
import { useAngleRewardsMultipleChains } from '@sushiswap/react-query'
import { ChainId } from '@sushiswap/chain'
import { Carousel } from '@sushiswap/ui/future/components/Carousel'
import { RewardSlide } from './RewardSlide'
import { useAccount } from 'wagmi'
import { RewardsSectionItem } from './RewardsSectionItem'
import Container from '@sushiswap/ui/future/components/Container'
import { usePoolFilters } from '../PoolsFiltersProvider'

export const RewardsSection: FC = () => {
  const { address } = useAccount()
  const { chainIds, tokenSymbols } = usePoolFilters()
  const { data } = useAngleRewardsMultipleChains({
    chainIds: [ChainId.POLYGON],
    account: address,
  })

  const positions = useMemo(() => {
    const _tokenSymbols = tokenSymbols?.filter((el) => el !== '') || []
    return (data ?? [])
      .filter((el) => chainIds.includes(el.chainId))
      .map((el) => {
        return Object.values(el.pools ?? {})
          .filter((el) =>
            _tokenSymbols.length > 0
              ? _tokenSymbols.some((symbol) => {
                  return [el.token0.symbol, el.token1.symbol].includes(symbol.toUpperCase())
                })
              : true
          )
          .filter((el) => +(el.userTVL ?? 0) > 0)
      })
      .flat()
  }, [chainIds, tokenSymbols, data])

  return (
    <>
      <div className="pl-4 xl:pl-2">
        <Container maxWidth="7xl" className="px-4 mx-auto !py-4">
          <h1 className="font-medium text-sm my-2 text-gray-700 dark:text-slate-200">
            Claim your rewards per network.
          </h1>
        </Container>
        <Carousel
          containerWidth={1280}
          slides={data ?? []}
          render={(row) => <RewardSlide data={row} address={address} />}
          className="!pt-0"
        />
      </div>
      <Container maxWidth="7xl" className="px-4 mx-auto mb-[120px]">
        <h1 className="font-medium text-sm my-2 text-gray-700 dark:text-slate-200">
          Positions that are receiving rewards ({positions.length})
        </h1>
        <div className="flex flex-col gap-4">
          {positions.map((item, i) => {
            return <RewardsSectionItem data={item} key={i} />
          })}
        </div>
      </Container>
    </>
  )
}
