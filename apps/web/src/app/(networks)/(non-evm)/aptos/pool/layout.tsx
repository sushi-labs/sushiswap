import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { Header } from '../header'
import { Providers } from './providers'

export const metadata = {
  title: 'Pool',
}

export default function PoolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header supportedNetworks={POOL_SUPPORTED_NETWORKS} />
      <main className="flex flex-col h-full flex-1">{children}</main>
    </Providers>
  )
}
