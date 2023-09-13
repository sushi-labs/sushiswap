import { Container } from '@sushiswap/ui'
import React from 'react'

import { PoolsFiltersProvider } from '../../../../ui/pool'
import { TableFiltersNetwork } from '../../../../ui/pool/TableFiltersNetwork'
import { TableFiltersResetButton } from '../../../../ui/pool/TableFiltersResetButton'
import { TableFiltersSearchToken } from '../../../../ui/pool/TableFiltersSearchToken'
import { BentoBoxTokenTable } from '../../components/TableSection/BentoBoxTokens'

export default function VaultPage() {
  return (
    <PoolsFiltersProvider>
      <Container maxWidth="7xl" className="px-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <TableFiltersSearchToken />
          <TableFiltersNetwork />
          <TableFiltersResetButton />
        </div>
        <BentoBoxTokenTable />
      </Container>
    </PoolsFiltersProvider>
  )
}
