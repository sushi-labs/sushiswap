import { Container } from '@sushiswap/ui'
import React from 'react'
// import { PoolFiltersFarmsOnly } from '~aptos/pool/ui/pools/filters/pool-filters-farms-only'
import { PoolFiltersSearchToken } from '~aptos/pool/ui/pools/filters/pool-filters-search-token'
import { PoolsTable } from '~aptos/pool/ui/pools/tables/pools/pools-table'

export default async function PoolsPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <PoolFiltersSearchToken />
        {/* <PoolFiltersFarmsOnly /> */}
      </div>
      <PoolsTable />
    </Container>
  )
}
