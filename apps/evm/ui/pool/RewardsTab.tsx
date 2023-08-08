import { CardDescription, CardHeader, CardTitle, Container } from '@sushiswap/ui'
import React from 'react'

import { RewardsSection } from './RewardsSection'

export const RewardsTab = () => {
  return (
    <>
      <Container maxWidth="7xl" className="px-4 mx-auto">
        <CardHeader className="!px-0">
          <CardTitle>We changed the way you can claim rewards.</CardTitle>
          <CardDescription>
            Instead of claiming rewards per liquidity position, <br /> press claim to claim your rewards for all your
            liquidity positions on a single network
          </CardDescription>
        </CardHeader>
      </Container>
      <RewardsSection />
    </>
  )
}
