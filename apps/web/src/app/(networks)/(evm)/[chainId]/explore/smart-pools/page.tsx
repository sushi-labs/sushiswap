import {
  SmartPoolChainIds,
  isSmartPoolChainId,
} from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import React, {} from 'react'
import { TableFiltersNetwork } from 'src/app/(networks)/_ui/table-filters-network'
import { TableFiltersSearchToken } from 'src/app/(networks)/_ui/table-filters-search-token'
import { SteerSmartPoolsTable } from 'src/lib/steer/components/steer-smart-pools-table'
import type { EvmChainId } from 'sushi/evm'
import { TableFiltersFarmsOnly } from '~evm/[chainId]/_ui/table-filters-farms-only'
import { TableFiltersPoolType } from '~evm/[chainId]/_ui/table-filters-pool-type'
import { TableFiltersResetButton } from '~evm/[chainId]/_ui/table-filters-reset-button'

export default async function SmartPoolsPage(props: {
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const chainId = +params.chainId as EvmChainId

  if (!isSmartPoolChainId(chainId)) {
    return notFound()
  }

  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <TableFiltersSearchToken />
        <TableFiltersPoolType />
        <TableFiltersNetwork
          network={chainId}
          supportedNetworks={SmartPoolChainIds}
          unsupportedNetworkHref={'/arbitrum/explore/smart-pools'}
          className="lg:hidden block"
        />
        <TableFiltersFarmsOnly />
        <TableFiltersResetButton />
      </div>
      <SteerSmartPoolsTable chainId={chainId} />
    </Container>
  )
}
