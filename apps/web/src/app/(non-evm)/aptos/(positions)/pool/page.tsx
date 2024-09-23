'use client'

import { Container } from '@sushiswap/ui'
import { Suspense } from 'react'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { TableFiltersNetwork } from 'src/ui/pool/TableFiltersNetwork'

// import { PoolFiltersFarmsOnly } from '~aptos/pool/ui/pools/filters/pool-filters-farms-only'
import { PoolFiltersSearchToken } from '~aptos/pool/ui/pools/filters/pool-filters-search-token'
import { PositionsTable } from '~aptos/pool/ui/pools/tables/positions/pool-positions-table'

export default function MyPositionsPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <PoolFiltersSearchToken />
        <TableFiltersNetwork
          network="aptos"
          supportedNetworks={POOL_SUPPORTED_NETWORKS}
          unsupportedNetworkHref="/ethereum/pool"
          className="lg:hidden block"
        />
        {/* <PoolFiltersFarmsOnly /> */}
      </div>
      <Suspense>
        <PositionsTable />
      </Suspense>
    </Container>
  )
}
