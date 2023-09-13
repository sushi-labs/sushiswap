import { Container } from '@sushiswap/ui/components/container'
import React from 'react'

import { PoolFilters } from './PoolFilters'

export const Pools = () => {
  return (
    <Container maxWidth="7xl" className="px-4 mx-auto">
      <div className="space-y-4">
        <PoolFilters />
      </div>
    </Container>
  )
}
