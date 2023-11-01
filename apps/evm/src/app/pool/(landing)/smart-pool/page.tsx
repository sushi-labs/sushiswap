import { Container } from '@sushiswap/ui'
import React from 'react'

import { TableFiltersFarmsOnly } from '../../../../ui/pool/TableFiltersFarmsOnly'
import { TableFiltersNetwork } from '../../../../ui/pool/TableFiltersNetwork'
import { TableFiltersPoolType } from '../../../../ui/pool/TableFiltersPoolType'
import { TableFiltersResetButton } from '../../../../ui/pool/TableFiltersResetButton'
import { SmartPoolsTable } from '../../../../ui/pool/SmartPoolsTable'

export default async function PoolPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <TableFiltersPoolType />
        <TableFiltersNetwork />
        <TableFiltersFarmsOnly />
        <TableFiltersResetButton />
      </div>
      <SmartPoolsTable />
    </Container>
  )
}
