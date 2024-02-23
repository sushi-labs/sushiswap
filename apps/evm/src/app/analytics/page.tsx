import { Container } from '@sushiswap/ui'
import { Suspense } from 'react'

import { TridentDeprecationMessage } from 'src/ui/pool/TridentDeprecationMessage'
import { PoolsFiltersProvider } from '../../ui/pool'
import { PoolsTable } from '../../ui/pool/PoolsTable'
import { TableFiltersFarmsOnly } from '../../ui/pool/TableFiltersFarmsOnly'
import { TableFiltersNetwork } from '../../ui/pool/TableFiltersNetwork'
import { TableFiltersPoolType } from '../../ui/pool/TableFiltersPoolType'
import { TableFiltersResetButton } from '../../ui/pool/TableFiltersResetButton'
import { TableFiltersSearchToken } from '../../ui/pool/TableFiltersSearchToken'

export default function AnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <PoolsFiltersProvider>
        <Container maxWidth="7xl" className="px-4">
          <div className="flex flex-wrap gap-3 mb-4">
            <TableFiltersSearchToken />
            <TableFiltersPoolType />
            <TableFiltersNetwork />
            <TableFiltersFarmsOnly />
            <TableFiltersResetButton />
          </div>
          <TridentDeprecationMessage />
          <PoolsTable />
        </Container>
      </PoolsFiltersProvider>
    </Suspense>
  )
}
