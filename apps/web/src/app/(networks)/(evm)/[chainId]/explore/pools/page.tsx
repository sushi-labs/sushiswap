import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { Container, Message } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import React from 'react'
import { TableFiltersNetwork } from 'src/app/(networks)/_ui/table-filters-network'
import { TableFiltersSearchToken } from 'src/app/(networks)/_ui/table-filters-search-token'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { EvmChainId } from 'sushi/evm'
import { PoolsTable } from '~evm/[chainId]/_ui/pools-table'
import { TableFiltersFarmsOnly } from '~evm/[chainId]/_ui/table-filters-farms-only'
import { TableFiltersPoolType } from '~evm/[chainId]/_ui/table-filters-pool-type'
import { TableFiltersResetButton } from '~evm/[chainId]/_ui/table-filters-reset-button'

export default async function PoolsPage(props: {
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const chainId = +params.chainId

  if (!isPoolChainId(chainId)) {
    return notFound()
  }

  return (
    <Container maxWidth="7xl" className="px-4">
      {chainId === EvmChainId.KATANA ? (
        <Message size="sm" className="mb-3">
          Notice: Katana subgraphs are currently experiencing issues. Some data
          may be unavailable or delayed.
        </Message>
      ) : null}
      <div className="flex flex-wrap gap-3 mb-4">
        <TableFiltersSearchToken />
        <TableFiltersPoolType />
        <TableFiltersNetwork
          network={chainId}
          supportedNetworks={POOL_SUPPORTED_NETWORKS}
          unsupportedNetworkHref="/ethereum/explore/pools"
          className="lg:hidden block"
        />
        <TableFiltersFarmsOnly />
        <TableFiltersResetButton />
      </div>
      <PoolsTable chainId={chainId} />
    </Container>
  )
}
