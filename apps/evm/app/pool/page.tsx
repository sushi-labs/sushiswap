'use client'

import { ChainId } from '@sushiswap/chain'
import { Carousel } from '@sushiswap/ui/components/Carousel'
import { Container } from '@sushiswap/ui/components/container'
import { isSushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useAccount } from '@sushiswap/wagmi'
import React from 'react'
import { PositionCard, PositionCardSkeleton } from 'ui/migrate/position-card'
import { PositionCardList } from 'ui/migrate/position-card-list'

import { PoolsFiltersProvider, PoolsSection } from '../../ui/pool'
import { Hero } from './hero'

export default function PoolPage() {
  const { address } = useAccount()
  return (
    <>
      <Container maxWidth="7xl" className="mx-auto px-4 pt-[80px] lg:pb-[54px]">
        <Hero />
      </Container>
      {address && (
        <PositionCardList>
          {({ positions, isLoading }) => {
            const slides = positions?.filter((position) => isSushiSwapV3ChainId(position?.chainId as ChainId))
            return !isLoading && slides.length > 0 ? (
              <section className="flex flex-col gap-3 py-10 lg:py-[54px]">
                <Container maxWidth="7xl" className="px-4 mx-auto">
                  <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-slate-200 lg:text-start">
                    Migrate <span className="text-gray-500 dark:text-slate-500">for increased efficiency.</span>
                  </h1>
                </Container>
                <div className="pl-4 xl:pl-2">
                  <Carousel
                    slideWidth={320}
                    slides={slides}
                    render={(position) => (isLoading ? <PositionCardSkeleton /> : <PositionCard position={position} />)}
                  />
                </div>
              </section>
            ) : (
              <></>
            )
          }}
        </PositionCardList>
      )}
      <PoolsFiltersProvider>
        <PoolsSection />
      </PoolsFiltersProvider>
    </>
  )
}
