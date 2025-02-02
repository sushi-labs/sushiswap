import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { ChainId } from 'sushi/chain'
import { SidebarContainer } from '~evm/_common/ui/sidebar'

export const metadata: Metadata = {
  title: 'Tokens',
  description: 'Explore SushiSwap tokens.',
}

export default async function ExploreLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId as ChainId

  if (!isPoolChainId(chainId)) {
    return notFound()
  }

  return (
    <SidebarContainer
      selectedNetwork={chainId}
      supportedNetworks={POOL_SUPPORTED_NETWORKS}
      unsupportedNetworkHref={'/ethereum/explore/pools'}
      shiftContent
    >
      {children}
    </SidebarContainer>
  )
}
