import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { MvmChainId } from 'sushi/mvm'
import { Header } from '../../../_ui/header/header'
import { Providers } from './providers'

export const metadata = {
  title: 'Pool',
}

export default function PoolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header
        chainId={MvmChainId.APTOS}
        supportedNetworks={POOL_SUPPORTED_NETWORKS}
      />
      <main className="flex flex-col h-full flex-1 animate-slide">
        {children}
      </main>
    </Providers>
  )
}
