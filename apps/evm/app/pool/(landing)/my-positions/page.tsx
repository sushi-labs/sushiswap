'use client'

import { Container } from '@sushiswap/ui'
import React from 'react'

import { PositionsTab } from '../../../../ui/pool/PoolsSection/PositionsTab'
import { TableFiltersResetButton, TableFiltersSearchToken } from '../../../../ui/pool/PoolsSection/Tables/TableFilters'
import { TableFiltersNetwork } from '../../../../ui/pool/PoolsSection/Tables/TableFilters/TableFiltersNetwork'

export default function MyPositionsPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <TableFiltersSearchToken />
        <TableFiltersNetwork />
        <TableFiltersResetButton />
      </div>
      <PositionsTab />
    </Container>
  )
}
