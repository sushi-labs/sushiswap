'use client'

import { ChainId } from 'sushi/chain'
import { Card, CardDescription, CardHeader, CardTitle, Carousel, Container } from '@sushiswap/ui'
import { isSushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useAccount } from '@sushiswap/wagmi'
import React from 'react'

import { PositionCard, PositionCardSkeleton } from './PositionCard'
import { PositionCardList } from './PositionCardList'

export const MigrateTabContent = () => {
  const { address } = useAccount()

  return (
    <div className="mb-40">
      <Container maxWidth="7xl" className="px-4 mx-auto">
        <CardHeader className="!px-0">
          <CardTitle>Migrate.</CardTitle>
          <CardDescription>
            By migrating your liquidity positions, <br /> you will benefit from increased capital efficiency.
          </CardDescription>
        </CardHeader>
      </Container>
      {address && (
        <PositionCardList>
          {({ positions, isLoading }) => {
            if (!isLoading && positions.length === 0) {
              return (
                <Container maxWidth="7xl" className="px-4">
                  <Card className="min-h-[276px] flex justify-center items-center p-6">
                    <span className="text-sm text-muted-foreground">No positions found for migration.</span>
                  </Card>
                </Container>
              )
            }

            return !isLoading ? (
              <Carousel
                slideWidth={320}
                slides={positions.filter((position) => isSushiSwapV3ChainId(position?.chainId as ChainId))}
                render={(position) => <PositionCard position={position} />}
                className="px-2"
              />
            ) : (
              <Container maxWidth="7xl" className="pt-4 px-2 pb-10 mx-auto">
                <PositionCardSkeleton />
              </Container>
            )
          }}
        </PositionCardList>
      )}
    </div>
  )
}
