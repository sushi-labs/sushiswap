'use client'

import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import React, { use } from 'react'
import { TableFiltersNetwork } from 'src/app/(networks)/_ui/TableFiltersNetwork'
import { TableFiltersSearchToken } from 'src/app/(networks)/_ui/TableFiltersSearchToken'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { type EvmChainId, isSushiSwapChainId } from 'sushi/evm'
import { TableFiltersResetButton } from '~evm/[chainId]/_ui/TableFiltersResetButton'
import { PositionsTab } from './_ui/PositionsTab'

export default function MyPositionsPage(props: {
  params: Promise<{ chainId: string }>
}) {
  const params = use(props.params)
  const chainId = +params.chainId as EvmChainId

  if (!isSushiSwapChainId(chainId)) {
    return notFound()
  }

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
      <PositionsTab chainId={chainId} />
    </Container>
  )
}
