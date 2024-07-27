'use client'

import { Container } from '@sushiswap/ui'

import { PoolFiltersSearchToken } from '../ui/pools/filters/pool-filters-search-token'
import { PoolsTable } from '../ui/pools/tables/pools/PoolsTable'
// import { TableFiltersFarmsOnly } from '../../../components/TableFiltersFarmsOnly'

export default function Page() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <PoolFiltersSearchToken />
        {/* <TableFiltersFarmsOnly /> */}
      </div>
      <PoolsTable />
    </Container>
  )
}
