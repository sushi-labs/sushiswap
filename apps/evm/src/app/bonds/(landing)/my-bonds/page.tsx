'use client'

import { Container } from '@sushiswap/ui'
import React from 'react'
import { BondsPositionsTable } from '../../../../ui/bonds'
import { useBondPositionsFilters } from '../../../../ui/bonds/bonds-positions-table/bonds-positions-table-filters/bonds-positions-filters-provider'
import { PositionsTableFiltersNetwork } from '../../../../ui/bonds/bonds-positions-table/bonds-positions-table-filters/table-positions-filters-networks'
import { PositionsTableFiltersResetButton } from '../../../../ui/bonds/bonds-positions-table/bonds-positions-table-filters/table-positions-filters-reset-button'
import { TableFiltersUnredeemedOnly } from '../../../../ui/bonds/bonds-positions-table/bonds-positions-table-filters/table-positions-filters-unredeemed-only'

export default function MyBondsPage() {
  const { chainIds, onlyUnredeemed } = useBondPositionsFilters()

  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <PositionsTableFiltersNetwork />
        <TableFiltersUnredeemedOnly />
        <PositionsTableFiltersResetButton />
      </div>
      <BondsPositionsTable
        chainIds={chainIds}
        onlyUnredeemed={onlyUnredeemed}
      />
    </Container>
  )
}
