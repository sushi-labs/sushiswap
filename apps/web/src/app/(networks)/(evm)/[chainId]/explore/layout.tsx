import type React from 'react'
import type { ChainId } from 'sushi/chain'
import { SidebarProvider } from '~evm/_common/ui/sidebar'
import { Header } from '../header'

export default async function ExploreLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId as ChainId

  return (
    <SidebarProvider>
      <Header chainId={chainId} />
      {children}
    </SidebarProvider>
  )
}
