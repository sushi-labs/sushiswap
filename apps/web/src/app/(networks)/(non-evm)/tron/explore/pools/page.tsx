import { Container } from '@sushiswap/ui'
import React from 'react'
import { TableFiltersSearchToken } from 'src/app/(networks)/_ui/TableFiltersSearchToken'
import { TableFiltersResetButton } from '~evm/[chainId]/_ui/TableFiltersResetButton'
import { PoolsTable } from '~tron/_common/ui/Pools/PoolsTable/PoolsTable'

export default async function PoolsPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <TableFiltersSearchToken />
        <TableFiltersResetButton />
      </div>
      <PoolsTable />
    </Container>
  )
}
