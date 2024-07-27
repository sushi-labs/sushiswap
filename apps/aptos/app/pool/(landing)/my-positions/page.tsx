'use client'

import { Container } from '@sushiswap/ui'

import { PoolFiltersFarmsOnly } from 'app/pool/ui/pools/filters/pool-filters-farms-only'
import { PoolFiltersSearchToken } from 'app/pool/ui/pools/filters/pool-filters-search-token'
import { PositionsTable } from 'app/pool/ui/pools/tables/positions/pool-positions-table'

export default function MyPositionsPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <PoolFiltersSearchToken />
        <PoolFiltersFarmsOnly />
      </div>
      <PositionsTable />
    </Container>
  )
}
