import { Container } from '@sushiswap/ui'
import React, { Suspense } from 'react'

import { FuroTokenTable } from '../../../ui/analytics/furo-token-table'
import { PoolsFiltersProvider } from '../../../ui/pool'
import { TableFiltersNetwork } from '../../../ui/pool/TableFiltersNetwork'
import { TableFiltersResetButton } from '../../../ui/pool/TableFiltersResetButton'
import { TableFiltersSearchToken } from '../../../ui/pool/TableFiltersSearchToken'

export default function PayPage() {
  return (
    <Suspense fallback={null}>
      <PoolsFiltersProvider>
        <Container maxWidth="7xl" className="px-4">
          <div className="flex flex-wrap gap-3 mb-4">
            <TableFiltersSearchToken />
            <TableFiltersNetwork />
            <TableFiltersResetButton />
          </div>
          <FuroTokenTable />
        </Container>
      </PoolsFiltersProvider>
    </Suspense>
  )
}
