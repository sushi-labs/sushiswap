'use client'

import { Container } from '@sushiswap/ui'
import { Suspense } from 'react'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { TableFiltersNetwork } from 'src/ui/pool/TableFiltersNetwork'
import { TableFiltersSearchToken } from 'src/ui/pool/TableFiltersSearchToken'
import { ChainId } from 'sushi'
import { PositionsTable } from '~kadena/_common/ui/Pools/PositionsTable/PositionsTable'

export default function MyPositionsPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <TableFiltersSearchToken />
        <TableFiltersNetwork
          network={ChainId.KADENA}
          supportedNetworks={POOL_SUPPORTED_NETWORKS}
          unsupportedNetworkHref="/ethereum/pool"
          className="lg:hidden block"
        />
      </div>
      <Suspense>
        <PositionsTable />
      </Suspense>
    </Container>
  )
}
