import { Container } from '@sushiswap/ui'
import React from 'react'
import { TableFiltersSmartPoolsOnly } from 'ui/pool/TableFilterSmartPoolsOnly'

import { PoolsFiltersProvider } from '../../../ui/pool'
import { PoolsTable } from '../../../ui/pool/PoolsTable'
import { TableFiltersFarmsOnly } from '../../../ui/pool/TableFiltersFarmsOnly'
import { TableFiltersNetwork } from '../../../ui/pool/TableFiltersNetwork'
import { TableFiltersPoolType } from '../../../ui/pool/TableFiltersPoolType'
import { TableFiltersResetButton } from '../../../ui/pool/TableFiltersResetButton'
import { TableFiltersSearchToken } from '../../../ui/pool/TableFiltersSearchToken'

export default async function PoolPage() {
  return (
    <>
      <PoolsFiltersProvider>
        <Container maxWidth="7xl" className="px-4">
          <div className="flex flex-wrap gap-3 mb-4">
            <TableFiltersSearchToken />
            <TableFiltersPoolType />
            <TableFiltersNetwork />
            <TableFiltersFarmsOnly />
            <TableFiltersSmartPoolsOnly />
            <TableFiltersResetButton />
          </div>
          <PoolsTable />
        </Container>
      </PoolsFiltersProvider>
    </>
  )
}
