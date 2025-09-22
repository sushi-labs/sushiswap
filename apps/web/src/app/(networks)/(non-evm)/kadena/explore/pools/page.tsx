import { Container } from '@sushiswap/ui'
import React from 'react'
import { TableFiltersNetwork } from 'src/app/(networks)/_ui/table-filters-network'
import { TableFiltersSearchToken } from 'src/app/(networks)/_ui/table-filters-search-token'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { ChainId } from 'sushi'
import { PoolsTable } from '~kadena/_common/ui/Pools/PoolsTable/PoolsTable'

export default async function PoolsPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <TableFiltersSearchToken />
        <TableFiltersNetwork
          network={ChainId.KADENA}
          supportedNetworks={POOL_SUPPORTED_NETWORKS}
          unsupportedNetworkHref="/ethereum/explore/pools"
          className="block lg:hidden"
        />
      </div>
      <PoolsTable />
    </Container>
  )
}
