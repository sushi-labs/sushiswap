'use client'

import { Container } from '@sushiswap/ui'
import { TableFiltersSearchToken } from 'components/TableFiltersSearchToken'
import { PoolsTable } from '../../../components/PoolsSection/Tables/Pools/PoolsTable'
import { TableFiltersFarmsOnly } from '../../../components/TableFiltersFarmsOnly'

export default function Page() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <TableFiltersSearchToken />
        <TableFiltersFarmsOnly />
      </div>
      <PoolsTable />
    </Container>
  )
}
