import { ChainId } from 'sushi/chain'
import { SidebarProvider } from '~evm/_common/ui/sidebar'
import { Header } from '../header'
import { Providers } from './providers'

export default async function TradeLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId as ChainId

  return (
    <Providers>
      <SidebarProvider>
        <Header chainId={chainId} />
        {children}
      </SidebarProvider>
    </Providers>
  )
}
