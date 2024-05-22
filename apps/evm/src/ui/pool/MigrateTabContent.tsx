'use client'

import {
  CardDescription,
  CardHeader,
  CardTitle,
  Carousel,
  Container,
} from '@sushiswap/ui'
import React from 'react'
import { ChainId } from 'sushi/chain'
import { isSushiSwapV3ChainId } from 'sushi/config'

import { useIsMounted } from '@sushiswap/hooks'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'wagmi'
import { PositionCard, PositionCardSkeleton } from './PositionCard'
import { PositionCardList } from './PositionCardList'

function MigrateTabContentPositions() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <Container maxWidth="7xl" className="px-4">
        <ConnectButton />
      </Container>
    )
  }

  return (
    <PositionCardList>
      {({ positions, isLoading }) => {
        if (!isLoading && positions.length === 0) {
          return (
            <Container maxWidth="7xl" className="px-4">
              <span className="text-sm text-muted-foreground">
                No positions found for migration.
              </span>
            </Container>
          )
        }

        return !isLoading ? (
          <Carousel
            slideWidth={320}
            slides={positions.filter((position) =>
              isSushiSwapV3ChainId(position?.chainId as ChainId),
            )}
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
  )
}

export const MigrateTabContent = () => {
  const isMounted = useIsMounted()

  return (
    <div className="mb-40">
      <Container maxWidth="7xl" className="px-4 mx-auto">
        <CardHeader className="!px-0">
          <CardTitle>Migrate.</CardTitle>
          <CardDescription>
            By migrating your liquidity positions,
            <br />
            you will benefit from increased capital efficiency.
          </CardDescription>
        </CardHeader>
      </Container>
      {isMounted ? <MigrateTabContentPositions /> : null}
    </div>
  )
}
