import type { ChainId } from 'sushi/chain'
import { Header } from '../header'
import { Providers } from './providers'
import { HeaderNetworkSelectorProvider } from 'src/lib/wagmi/components/header-network-selector';

export default async function TradeLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId as ChainId

  return (
    <Providers>
      <HeaderNetworkSelectorProvider>
        <Header chainId={chainId} />
        {children}
      </HeaderNetworkSelectorProvider>
    </Providers>
  )
}
