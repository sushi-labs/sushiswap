import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import React from 'react'
import { TableFiltersNetwork } from 'src/app/(networks)/_ui/TableFiltersNetwork'
import { TableFiltersSearchToken } from 'src/app/(networks)/_ui/TableFiltersSearchToken'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { PoolsTable } from '~evm/[chainId]/_ui/PoolsTable'
import { TableFiltersFarmsOnly } from '~evm/[chainId]/_ui/TableFiltersFarmsOnly'
import { TableFiltersPoolType } from '~evm/[chainId]/_ui/TableFiltersPoolType'
import { TableFiltersResetButton } from '~evm/[chainId]/_ui/TableFiltersResetButton'

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
