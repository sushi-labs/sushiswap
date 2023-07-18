import { ChainId } from '@sushiswap/chain'
import { typographyVariants } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui'
import { Carousel } from '@sushiswap/ui'
import { Label } from '@sushiswap/ui'
import { isSushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useAccount } from '@sushiswap/wagmi'
import React from 'react'

import { PositionCard, PositionCardSkeleton } from '../../migrate/position-card'
import { PositionCardList } from '../../migrate/position-card-list'

export const MigrateTab = () => {
  const { address } = useAccount()

  return (
    <div className="mb-40">
      <Container maxWidth="7xl" className="px-4 mx-auto">
        <div className="flex flex-col justify-center gap-1 py-10">
          <h1 className={typographyVariants({ variant: 'h3', className: 'text-center' })}>Migrate.</h1>
          <p className={typographyVariants({ variant: 'muted', className: 'text-center' })}>
            By migrating your liquidity positions, <br /> you will benefit from increased capital efficiency.
          </p>
        </div>
        <Label>Available positions</Label>
      </Container>
      {address && (
        <PositionCardList>
          {({ positions, isLoading }) =>
            !isLoading ? (
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
          }
        </PositionCardList>
      )}
    </div>
  )
}
