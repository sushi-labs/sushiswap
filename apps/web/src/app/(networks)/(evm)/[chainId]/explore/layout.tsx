import React from 'react'
import { ChainId } from 'sushi/chain'
import { SidebarProvider } from '~evm/_common/ui/sidebar'
import { Header } from '../header'

export const metadata = {
  title: 'Pools 💦',
}

export default async function ExploreLayout({
  children,
  params,
}: { children: React.ReactNode; params: { chainId: string } }) {
  const chainId = +params.chainId as ChainId

  return (
    <SidebarProvider>
      <Header chainId={chainId} />
      {children}
    </SidebarProvider>
  )
}
