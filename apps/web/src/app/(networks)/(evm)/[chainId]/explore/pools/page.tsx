import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import React from 'react'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { PoolsTableV2 } from 'src/ui/pool/PoolsTableV2'
import { TableFiltersFarmsOnly } from 'src/ui/pool/TableFiltersFarmsOnly'
import { TableFiltersNetwork } from 'src/ui/pool/TableFiltersNetwork'
import { TableFiltersPoolType } from 'src/ui/pool/TableFiltersPoolType'
import { TableFiltersResetButton } from 'src/ui/pool/TableFiltersResetButton'
import { TableFiltersSearchToken } from 'src/ui/pool/TableFiltersSearchToken'
import type { ChainId } from 'sushi/chain'

export default async function PoolsPage(props: {
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const chainId = +params.chainId as ChainId

  if (!isPoolChainId(chainId)) {
    return notFound()
  }

  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3>All Pools</h3>
        <div className="flex gap-3 flex-wrap">
          <TableFiltersSearchToken />
          <TableFiltersPoolType />
          <TableFiltersNetwork
            network={chainId}
            supportedNetworks={POOL_SUPPORTED_NETWORKS}
            unsupportedNetworkHref="/ethereum/explore/pools"
            className="lg:hidden block"
          />
        </div>
        {/* <TableFiltersFarmsOnly /> */}
        <TableFiltersResetButton />
      </div>
      <PoolsTableV2 chainId={chainId} />
    </Container>
  )
}
