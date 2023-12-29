import { BondsApiSchema } from '@sushiswap/client/api'
import { Container } from '@sushiswap/ui'
import React from 'react'
import { BondsTableWrapper } from 'src/ui/bonds/bonds-table/bonds-table-wrapper'
import {
  BondsFiltersProvider,
  TableFiltersAuctionType,
  TableFiltersNetwork,
  TableFiltersOpenOnly,
  TableFiltersPositiveDiscountOnly,
  TableFiltersResetButton,
} from '../../../../ui/bonds'

export default async function BondsPage({
  searchParams,
}: { searchParams: typeof BondsApiSchema._input }) {
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
        <BondsTableWrapper params={searchParams} />
      </Container>
    </BondsFiltersProvider>
  )
}
