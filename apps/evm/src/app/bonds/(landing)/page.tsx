import { getBonds } from '@sushiswap/client'
import { BondsApiSchema } from '@sushiswap/client/api'
import { Container } from '@sushiswap/ui'
import React from 'react'
import {
  BondsTable,
  TableFiltersAuctionType,
  TableFiltersNetwork,
  TableFiltersPositiveDiscountOnly,
  TableFiltersOpenOnly,
  TableFiltersResetButton,
} from '../../../ui/bonds'

export default async function BondsPage({
  searchParams,
}: { searchParams: typeof BondsApiSchema._input }) {
  const bonds = await getBonds(BondsApiSchema.parse(searchParams))

  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <TableFiltersNetwork />
        <TableFiltersAuctionType />
        <TableFiltersPositiveDiscountOnly />
        <TableFiltersOpenOnly />
        <TableFiltersResetButton />
      </div>
      <BondsTable initialData={bonds} />
    </Container>
  )
}
