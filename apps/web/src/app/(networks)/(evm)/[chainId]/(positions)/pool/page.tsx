import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import React from 'react'
import { TableFiltersNetwork } from 'src/app/(networks)/_ui/table-filters-network'
import { TableFiltersSearchToken } from 'src/app/(networks)/_ui/table-filters-search-token'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { isPublicBladeChainId } from 'src/config.server'
import {
  SushiSwapProtocol,
  isBladeChainId,
  isSushiSwapChainId,
} from 'sushi/evm'
import { TableFiltersResetButton } from '~evm/[chainId]/_ui/table-filters-reset-button'
import { PositionsTab } from './_ui/positions-tab'

export default async function MyPositionsPage(props: {
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const chainId = +params.chainId

  const isBladeChain =
    isBladeChainId(chainId) && (await isPublicBladeChainId(chainId))

  if (!isSushiSwapChainId(chainId) && !isBladeChain) {
    return notFound()
  }

  const supportedProtocols: SushiSwapProtocol[] = [
    SushiSwapProtocol.SUSHISWAP_V2,
    SushiSwapProtocol.SUSHISWAP_V3,
    ...(isBladeChain ? [SushiSwapProtocol.BLADE] : []),
  ]

  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <TableFiltersSearchToken />
        <TableFiltersNetwork
          network={chainId}
          supportedNetworks={POOL_SUPPORTED_NETWORKS}
          unsupportedNetworkHref="/ethereum/pool"
          className="lg:hidden block"
        />
        <TableFiltersResetButton />
      </div>
      <PositionsTab chainId={chainId} supportedProtocols={supportedProtocols} />
    </Container>
  )
}
