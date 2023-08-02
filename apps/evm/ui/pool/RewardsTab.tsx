import { Container, typographyVariants } from '@sushiswap/ui'
import React from 'react'

import { RewardsSection } from './RewardsSection'

export const RewardsTab = () => {
  return (
    <>
      <Container maxWidth="7xl" className="px-4 mx-auto">
        <div className="flex flex-col justify-center gap-1 py-10">
          <h1 className={typographyVariants({ variant: 'h3', className: 'text-center' })}>
            We changed the way you can claim rewards.
          </h1>
          <p className={typographyVariants({ variant: 'muted', className: 'text-center' })}>
            Instead of claiming rewards per liquidity position, <br /> press claim to claim your rewards for all your
            liquidity positions on a single network
          </p>
        </div>
      </Container>
      <RewardsSection />
    </>
  )
}
