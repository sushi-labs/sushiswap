import { Container } from '@sushiswap/ui'
import React from 'react'
import { TableFiltersNetwork } from 'src/app/(networks)/_ui/table-filters-network'
import { TableFiltersSearchToken } from 'src/app/(networks)/_ui/table-filters-search-token'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { MvmChainId } from 'sushi/mvm'
import { PoolsTable } from '~aptos/pool/ui/tables/pools/pools-table'

export default async function PoolsPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <TableFiltersSearchToken />
        <TableFiltersNetwork
          network={MvmChainId.APTOS}
          supportedNetworks={POOL_SUPPORTED_NETWORKS}
          unsupportedNetworkHref="/ethereum/explore/pools"
          className="lg:hidden block"
        />
      </div>
      <PoolsTable />
    </Container>
  )
}
