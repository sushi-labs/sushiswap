import { Container } from '@sushiswap/ui'
import React from 'react'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { TableFiltersNetwork } from 'src/ui/pool/TableFiltersNetwork'
// import { PoolFiltersFarmsOnly } from '~aptos/pool/ui/pools/filters/pool-filters-farms-only'
import { PoolFiltersSearchToken } from '~aptos/pool/ui/pools/filters/pool-filters-search-token'
import { PoolsTable } from '~aptos/pool/ui/pools/tables/pools/pools-table'

export default async function PoolsPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <PoolFiltersSearchToken />
        {/* <PoolFiltersFarmsOnly /> */}
        <TableFiltersNetwork
          network={'aptos'}
          supportedNetworks={POOL_SUPPORTED_NETWORKS}
          unsupportedNetworkHref="/ethereum/explore/pools"
          className="lg:hidden block"
        />
      </div>
      <PoolsTable />
    </Container>
  )
}
