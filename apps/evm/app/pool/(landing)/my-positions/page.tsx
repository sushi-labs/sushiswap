'use client'

import { Container } from '@sushiswap/ui'
import React from 'react'

import { PositionsTab } from '../../../../ui/pool/PositionsTab'
import { TableFiltersNetwork } from '../../../../ui/pool/TableFiltersNetwork'
import { TableFiltersResetButton } from '../../../../ui/pool/TableFiltersResetButton'
import { TableFiltersSearchToken } from '../../../../ui/pool/TableFiltersSearchToken'

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
