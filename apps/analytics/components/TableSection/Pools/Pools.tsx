import Container from '@sushiswap/ui/future/components/Container'
import React from 'react'
import { PoolFilters } from './PoolFilters'
import { PoolTable } from './PoolTable'

export const Pools = () => {
  return (
    <Container maxWidth='7xl' className='px-4 mx-auto'>
      <div className='space-y-4'>
        <PoolFilters />
        <PoolTable />
      </div>
    </Container>
  )
}
