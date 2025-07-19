'use client'

import { Container, LinkExternal, Message } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import React, { use } from 'react'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { PositionsTab } from 'src/ui/pool/PositionsTab'
import { TableFiltersNetwork } from 'src/ui/pool/TableFiltersNetwork'
import { TableFiltersResetButton } from 'src/ui/pool/TableFiltersResetButton'
import { TableFiltersSearchToken } from 'src/ui/pool/TableFiltersSearchToken'
import { type EvmChainId, isSushiSwapChainId } from 'sushi/evm'

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
      <Message size="sm" variant="info" className="mb-4 text-center">
        Smart Pools are no longer supported in our app. To manage your Smart
        Pool positions, please visit:{' '}
        <LinkExternal href="https://app.steer.finance/profile">
          <span className="text-slate-300">
            https://app.steer.finance/profile
          </span>
        </LinkExternal>
      </Message>
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
