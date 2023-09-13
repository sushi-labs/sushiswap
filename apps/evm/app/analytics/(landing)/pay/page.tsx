import { Container } from '@sushiswap/ui'
import React from 'react'

import { PoolsFiltersProvider } from '../../../../ui/pool'
import { TableFiltersNetwork } from '../../../../ui/pool/TableFiltersNetwork'
import { TableFiltersResetButton } from '../../../../ui/pool/TableFiltersResetButton'
import { TableFiltersSearchToken } from '../../../../ui/pool/TableFiltersSearchToken'
import { FuroTokenTable } from '../../components/TableSection/FuroTokens'

export default function PayPage() {
  return (
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
  )
}
