import { Container } from '@sushiswap/ui'
import React from 'react'

import { PoolsFiltersProvider, PoolsTable } from '../../../ui/pool'
import {
  TableFiltersFarmsOnly,
  TableFiltersPoolType,
  TableFiltersResetButton,
  TableFiltersSearchToken,
} from '../../../ui/pool/PoolsSection/Tables/TableFilters'
import { TableFiltersNetwork } from '../../../ui/pool/PoolsSection/Tables/TableFilters/TableFiltersNetwork'

export default async function PoolPage() {
  return (
    <>
      <PoolsFiltersProvider>
        <Container maxWidth="7xl" className="px-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <TableFiltersSearchToken />
            <TableFiltersPoolType />
            <TableFiltersNetwork />
            <TableFiltersFarmsOnly />
            <TableFiltersResetButton />
          </div>
          <PoolsTable />
        </Container>
      </PoolsFiltersProvider>
    </>
  )
}
