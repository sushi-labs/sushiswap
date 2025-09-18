import { Container } from '@sushiswap/ui'
import React from 'react'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { TableFiltersNetwork } from 'src/ui/pool/TableFiltersNetwork'
import { TableFiltersSearchToken } from 'src/ui/pool/TableFiltersSearchToken'
import { PoolsTable } from '~stellar/_common/ui/ExplorePools/PoolsTable'

export default async function ExplorePoolsPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <TableFiltersSearchToken />
        <TableFiltersNetwork
          network={'stellar'}
          supportedNetworks={POOL_SUPPORTED_NETWORKS}
          unsupportedNetworkHref="/ethereum/explore/pools"
          className="lg:hidden block"
        />
      </div>
      <PoolsTable />
    </Container>
  )
}
