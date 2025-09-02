'use client'

import { Container } from '@sushiswap/ui'
import { Suspense } from 'react'
import { TableFiltersNetwork } from 'src/app/(networks)/_ui/table-filters-network'
import { TableFiltersSearchToken } from 'src/app/(networks)/_ui/table-filters-search-token'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { MvmChainId } from 'sushi/mvm'
import { PositionsTable } from '~aptos/pool/ui/tables/positions/pool-positions-table'

export default function MyPositionsPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <TableFiltersSearchToken />
        <TableFiltersNetwork
          network={MvmChainId.APTOS}
          supportedNetworks={POOL_SUPPORTED_NETWORKS}
          unsupportedNetworkHref="/ethereum/pool"
          className="lg:hidden block"
        />
        {/* <TableFiltersFarmsOnly /> */}
      </div>
      <Suspense>
        <PositionsTable />
      </Suspense>
    </Container>
  )
}
