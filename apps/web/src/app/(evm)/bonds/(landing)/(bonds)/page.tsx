import { Container } from '@sushiswap/ui'
import React from 'react'
import {
  BondsFiltersProvider,
  BondsTable,
  TableFiltersAuctionType,
  TableFiltersNetwork,
  TableFiltersOpenOnly,
  TableFiltersPositiveDiscountOnly,
  TableFiltersResetButton,
} from 'src/ui/bonds'

export default async function BondsPage() {
  return (
    <BondsFiltersProvider>
      <Container maxWidth="7xl" className="px-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <TableFiltersNetwork />
          <TableFiltersAuctionType />
          <TableFiltersPositiveDiscountOnly />
          <TableFiltersOpenOnly />
          <TableFiltersResetButton />
        </div>
        <BondsTable />
      </Container>
    </BondsFiltersProvider>
  )
}
