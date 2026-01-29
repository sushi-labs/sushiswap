import { PlusIcon } from '@heroicons/react/24/outline'
import { Button, Container, LinkInternal } from '@sushiswap/ui'
import React from 'react'
import { TableFiltersSearchToken } from 'src/app/(networks)/_ui/table-filters-search-token'
import { TableFiltersResetButton } from '~evm/[chainId]/_ui/table-filters-reset-button'
import { PoolsTable } from '~stellar/_common/ui/ExplorePools/PoolsTable'

export default async function ExplorePoolsPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-wrap gap-3 mb-4 justify-between items-center">
        <div className="flex flex-wrap gap-3">
          <TableFiltersSearchToken />
          <TableFiltersResetButton />
        </div>
        <LinkInternal href="/stellar/pool/add">
          <Button size="sm" className="gap-2">
            <PlusIcon className="w-4 h-4" />
            Create Pool
          </Button>
        </LinkInternal>
      </div>
      <PoolsTable />
    </Container>
  )
}
