import React from 'react'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { SidebarProvider, TronSidebarContainer } from 'src/ui/sidebar'
import { Header } from '../header'

export const metadata = {
  title: 'Pool',
}

export default function PoolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Header />
      <TronSidebarContainer
        supportedNetworks={POOL_SUPPORTED_NETWORKS}
        unsupportedNetworkHref={'/ethereum/explore/pools'}
        shiftContent
      >
        <main className="flex flex-col h-full flex-1">{children}</main>
      </TronSidebarContainer>
    </SidebarProvider>
  )
}
